import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Bow } from '../components/decorations/Ornaments';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col justify-center px-4 pb-16 pt-page-lg">
      <div className="mb-2 flex justify-center">
        <Bow className="h-14 w-16 text-blush-300" />
      </div>
      <EmptyState
        icon={Compass}
        title="这条小路走不通啦"
        description="页面可能被移动过，或者链接少了一个字符。回到首页重新出发吧。"
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => navigate('/')} leadingIcon={<Home className="h-4 w-4" />}>
              回到首页
            </Button>
            <Link
              to="/recipes"
              className="inline-flex h-11 items-center justify-center rounded-full border border-blush-200 bg-white/90 px-5 text-sm text-ink-700 transition-colors hover:bg-blush-50"
            >
              去菜谱大全
            </Link>
          </div>
        }
      />
      <p className="mt-6 text-center text-[10px] tracking-widest text-ink-300">
        PRINCESS KITCHEN
      </p>
    </div>
  );
}
