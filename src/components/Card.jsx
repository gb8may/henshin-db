import React from 'react';

export function CharacterCard({ character, onClick, imageUrl, t, lang = 'en' }) {
  const displayName = character[`name_${lang}`] || character.name_pt || character.name_en || character.name_jp || '';
  const description = character[`description_${lang}`] || character.description_pt || character.description_en || character.description_jp || '';
  const [imageError, setImageError] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(!!imageUrl);

  React.useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => setHasImage(true);
      img.onerror = () => {
        setHasImage(false);
        setImageError(true);
      };
      img.src = imageUrl;
    } else {
      setHasImage(false);
    }
  }, [imageUrl]);

  return (
    <div className="card" onClick={onClick}>
      <div className="flex gap-3 items-center">
        {hasImage && imageUrl && !imageError && (
          <div className="thumb">
            <img
              src={imageUrl}
              alt={character.name_en || ''}
              onError={() => {
                setImageError(true);
                setHasImage(false);
              }}
            />
          </div>
        )}
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

export function PublicationCard({ publication, onClick, t, lang = 'en' }) {
  const title = publication[`title_${lang}`] || publication.title_pt || publication.title_en || publication.title_jp || 'Publication';
  const notes = publication[`notes_${lang}`] || publication.notes_pt || publication.notes_en || publication.notes_jp || '';
  const cover = publication.cover_url || '';
  const [imageError, setImageError] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(!!cover);

  React.useEffect(() => {
    if (cover) {
      const img = new Image();
      img.onload = () => setHasImage(true);
      img.onerror = () => {
        setHasImage(false);
        setImageError(true);
      };
      img.src = cover;
    } else {
      setHasImage(false);
    }
  }, [cover]);

  return (
    <div className="card" onClick={onClick}>
      <div className="flex gap-3 items-center">
        {hasImage && cover && !imageError && (
          <div className="thumb">
            <img
              src={cover}
              alt={title}
              onError={() => {
                setImageError(true);
                setHasImage(false);
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

export function CollectibleCard({ collectible, onClick, t, lang = 'en' }) {
  const name = collectible[`name_${lang}`] || collectible.name_pt || collectible.name_en || collectible.name_jp || 'Collectible';
  const image = collectible.image_url || '';
  const [imageError, setImageError] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(!!image);

  React.useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => setHasImage(true);
      img.onerror = () => {
        setHasImage(false);
        setImageError(true);
      };
      img.src = image;
    } else {
      setHasImage(false);
    }
  }, [image]);

  const subtitleParts = [];
  if (collectible.line) subtitleParts.push(collectible.line);
  if (collectible.item_type) subtitleParts.push(collectible.item_type);
  if (collectible.manufacturer) subtitleParts.push(collectible.manufacturer);

  return (
    <div className="card" onClick={onClick}>
      <div className="flex gap-3 items-center">
        {hasImage && image && !imageError && (
          <div className="thumb">
            <img
              src={image}
              alt={name}
              onError={() => {
                setImageError(true);
                setHasImage(false);
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

