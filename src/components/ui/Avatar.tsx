import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';

interface AvatarProps {
  /** Emoji preset or a compressed `data:image/...` URL. */
  avatar: string;
  alt?: string;
  className?: string;
}

/**
 * Renders an emoji or an uploaded avatar, and gracefully falls back to a crown
 * if the stored image can no longer be decoded.
 */
export function Avatar({ avatar, alt = '我的头像', className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const isImage = avatar.startsWith('data:image/');

  useEffect(() => {
    setFailed(false);
  }, [avatar]);

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn('flex items-center justify-center overflow-hidden leading-none', className)}
    >
      {isImage && !failed ? (
        <img
          src={avatar}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true" className="leading-none">
          {isImage ? '👑' : avatar}
        </span>
      )}
    </div>
  );
}
