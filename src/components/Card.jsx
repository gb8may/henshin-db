import React from 'react';

export function CharacterCard({ character, onClick, imageUrl, t }) {
  const displayName = character.name_pt || character.name_en || character.name_jp || '';
  const description = character.description_pt || character.description_en || character.description_jp || '';

  return (
    <div className="card" onClick={onClick}>
      <div className="flex gap-3 items-center">
        <div className="thumb">
          <img
            src={imageUrl}
            alt={character.name_en || ''}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.textContent = '';
            }}
          />
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex gap-2.5 items-baseline min-w-0">
            <div className="font-bold text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {displayName}
            </div>
            {character.year && (
              <div className="text-xs text-toku-muted flex-shrink-0">{character.year}</div>
            )}
          </div>
          <div className="text-toku-muted text-xs leading-tight">
            {character.name_en}
          </div>
        </div>
      </div>
      {description && (
        <div className="mt-2 text-toku-muted text-[13px] leading-snug line-clamp-2">
          {description}
        </div>
      )}
    </div>
  );
}

export function GlossaryCard({ term, onClick, t }) {
  const title = term.pt || term.en || term.jp || 'Term';
  
  return (
    <div className="card" onClick={onClick}>
      <div className="flex gap-2.5 items-baseline min-w-0">
        <div className="font-bold text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis flex-1">
          {title}
        </div>
        {term.category && (
          <div className="text-xs text-toku-muted flex-shrink-0">{term.category}</div>
        )}
      </div>
      <div className="mt-2">
        <div className="flex flex-wrap gap-2 mb-1.5">
          {term.jp && <span className="pill">{term.jp}</span>}
          {term.romaji && <span className="pill">{term.romaji}</span>}
          {term.en && <span className="pill">{term.en}</span>}
        </div>
        {term.explanation && (
          <div className="text-toku-muted text-[13px] leading-snug">
            {term.explanation}
          </div>
        )}
      </div>
    </div>
  );
}

export function PublicationCard({ publication, onClick, t }) {
  const title = publication.title_pt || publication.title_en || publication.title_jp || 'Publication';
  const notes = publication.notes_pt || publication.notes_en || publication.notes_jp || '';
  const cover = publication.cover_url || '';

  return (
    <div className="card" onClick={onClick}>
      <div className="flex gap-3 items-center">
        {cover && (
          <div className="thumb">
            <img
              src={cover}
              alt={title}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.textContent = '';
              }}
            />
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex gap-2.5 items-baseline min-w-0">
            <div className="font-bold text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis flex-1">
              {title}
            </div>
            {publication.year && (
              <div className="text-xs text-toku-muted flex-shrink-0">{publication.year}</div>
            )}
          </div>
          <div className="text-toku-muted text-xs leading-tight">
            {publication.pub_type}
            {publication.publisher && ` · ${publication.publisher}`}
          </div>
        </div>
      </div>
      {notes && (
        <div className="mt-2 text-toku-muted text-[13px] leading-snug line-clamp-2">
          {notes}
        </div>
      )}
    </div>
  );
}

export function CollectibleCard({ collectible, onClick, t }) {
  const name = collectible.name_pt || collectible.name_en || collectible.name_jp || 'Collectible';
  const image = collectible.image_url || '';

  const subtitleParts = [];
  if (collectible.line) subtitleParts.push(collectible.line);
  if (collectible.item_type) subtitleParts.push(collectible.item_type);
  if (collectible.manufacturer) subtitleParts.push(collectible.manufacturer);

  return (
    <div className="card" onClick={onClick}>
      <div className="flex gap-3 items-center">
        {image && (
          <div className="thumb">
            <img
              src={`${image}?v=${Date.now()}`}
              alt={name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.textContent = '';
              }}
            />
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex gap-2.5 items-baseline min-w-0">
            <div className="font-bold text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis flex-1">
              {name}
            </div>
            {collectible.year && (
              <div className="text-xs text-toku-muted flex-shrink-0">{collectible.year}</div>
            )}
          </div>
          <div className="text-toku-muted text-xs leading-tight">
            {subtitleParts.join(' · ')}
          </div>
        </div>
      </div>
    </div>
  );
}

