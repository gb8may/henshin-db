import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function VisitCounter() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function trackVisit() {
      // Verifica se já visitou hoje (localStorage)
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem('lastVisit');
      const hasVisitedToday = lastVisit === today;

      if (!hasVisitedToday && navigator.onLine) {
        try {
          // Incrementa contador no Supabase
          const { data: currentData, error: fetchError } = await supabase
            .from('site_stats')
            .select('visit_count')
            .eq('id', 1)
            .single();

          if (fetchError && fetchError.code === 'PGRST116') {
            // Tabela não existe ou registro não existe, cria
            const { error: insertError } = await supabase
              .from('site_stats')
              .insert({ id: 1, visit_count: 1 });

            if (!insertError) {
              setCount(1);
              localStorage.setItem('lastVisit', today);
            }
          } else if (!fetchError && currentData) {
            // Atualiza contador
            const newCount = (currentData.visit_count || 0) + 1;
            const { error: updateError } = await supabase
              .from('site_stats')
              .update({ visit_count: newCount })
              .eq('id', 1);

            if (!updateError) {
              setCount(newCount);
              localStorage.setItem('lastVisit', today);
            }
          }
        } catch (err) {
          console.log('Erro ao registrar visita:', err);
        }
      }

      // Carrega contador atual
      try {
        const { data, error } = await supabase
          .from('site_stats')
          .select('visit_count')
          .eq('id', 1)
          .single();

        if (!error && data) {
          setCount(data.visit_count || 0);
        } else {
          // Fallback para localStorage
          const localCount = parseInt(localStorage.getItem('localVisitCount') || '0', 10);
          setCount(localCount);
        }
      } catch (err) {
        // Fallback para localStorage
        const localCount = parseInt(localStorage.getItem('localVisitCount') || '0', 10);
        setCount(localCount);
      } finally {
        setLoading(false);
      }
    }

    trackVisit();
  }, []);

  if (loading || count === null) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-3 z-30 pointer-events-none">
      <div className="text-[9px] text-toku-muted/30 font-mono tracking-tight">
        {count.toLocaleString()}
      </div>
    </div>
  );
}

