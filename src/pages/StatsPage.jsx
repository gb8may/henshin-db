import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { supabase } from '../lib/supabase';
import { BarChart3, Users, TrendingUp, Calendar } from 'lucide-react';

export function StatsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);

  useEffect(() => {
    // Verifica se já está autenticado
    const auth = localStorage.getItem('stats_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadStats();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Digite a senha');
      return;
    }

    setCheckingPassword(true);
    setError('');

    try {
      // Usa função do banco para verificar senha sem expor ela
      const { data, error: fetchError } = await supabase
        .rpc('verify_stats_password', { input_password: password });

      if (fetchError) {
        setError('Erro ao verificar senha. Tente novamente.');
        setCheckingPassword(false);
        return;
      }

      if (data === true) {
        setIsAuthenticated(true);
        localStorage.setItem('stats_auth', 'true');
        setError('');
        loadStats();
      } else {
        setError('Senha incorreta');
        setPassword('');
      }
    } catch (err) {
      console.error('Erro ao verificar senha:', err);
      setError('Erro ao verificar senha. Tente novamente.');
    } finally {
      setCheckingPassword(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('stats_auth');
    setPassword('');
    setStats(null);
  };

  async function loadStats() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('visit_count, updated_at')
        .eq('id', 1)
        .single();

      if (!error && data) {
        setStats({
          totalVisits: data.visit_count || 0,
          lastUpdate: data.updated_at || null,
        });
      } else {
        setStats({
          totalVisits: 0,
          lastUpdate: null,
        });
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setStats({
        totalVisits: 0,
        lastUpdate: null,
      });
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3.5 py-3.5 pb-[90px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
          <div className="flex gap-2.5 items-center mb-3">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost"
            >
              {t('back')}
            </button>
          </div>

          <div className="max-w-md mx-auto mt-20">
            <div className="card">
              <div className="text-center mb-6">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-toku-rider-primary" />
                <h2 className="font-bold text-lg mb-2">Estatísticas de Acesso</h2>
                <p className="text-toku-muted text-sm">Digite a senha para visualizar</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-toku-muted mb-1.5">Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="input-search w-full"
                    placeholder="Digite a senha"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center">{error}</div>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={checkingPassword}
                >
                  {checkingPassword ? 'Verificando...' : 'Acessar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3.5 py-3.5 pb-[90px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
        <div className="flex gap-2.5 items-center mb-3">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost"
          >
            {t('back')}
          </button>
        </div>

        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="font-bold text-base leading-tight">
            Estatísticas de Acesso
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost text-xs"
          >
            Sair
          </button>
        </div>

        {loading ? (
          <div className="text-toku-muted text-center py-8">{t('loading')}</div>
        ) : stats ? (
          <div className="grid gap-4">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-toku-rider-primary/20">
                  <Users className="w-6 h-6 text-toku-rider-primary" />
                </div>
                <div>
                  <div className="text-xs text-toku-muted mb-1">Total de Visitas</div>
                  <div className="text-2xl font-bold">
                    {stats.totalVisits.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {stats.lastUpdate && (
              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-toku-sentai-primary/20">
                    <Calendar className="w-6 h-6 text-toku-sentai-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-toku-muted mb-1">Última Atualização</div>
                    <div className="text-sm font-semibold">
                      {new Date(stats.lastUpdate).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-toku-hero-primary/20">
                  <TrendingUp className="w-6 h-6 text-toku-hero-primary" />
                </div>
                <div>
                  <div className="text-xs text-toku-muted mb-1">Status</div>
                  <div className="text-sm font-semibold">
                    Sistema ativo
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-toku-muted text-center py-8">
            Nenhuma estatística disponível
          </div>
        )}
      </div>
    </div>
  );
}

