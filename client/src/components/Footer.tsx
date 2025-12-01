import { APP_TITLE } from "@/const";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* アプリ情報 */}
          <div>
            <h3 className="font-semibold mb-3">{APP_TITLE}</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>

          {/* リンク */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.links')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.guide')}
                </Link>
              </li>
              <li>
                <Link href="/my-templates" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.myTemplates')}
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.favorites')}
                </Link>
              </li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* 製作者・寄付情報 */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.author')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">{t('footer.twitter')}: </span>
                <a 
                  href="https://x.com/kojima920" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @kojima920
                </a>
              </li>
              <li>
                <span className="text-muted-foreground">{t('footer.email')}: </span>
                <a 
                  href="mailto:mk19830920@gmail.com"
                  className="text-primary hover:underline"
                >
                  mk19830920@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <p className="text-muted-foreground mb-1">{t('footer.donation')}:</p>
                <p className="text-sm">
                  <span className="text-muted-foreground">{t('footer.paypay')}: </span>
                  <span className="font-semibold">kojima1459</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('footer.donationMessage')}
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground space-y-2">
          <p>{t('footer.copyright', { year: currentYear, title: APP_TITLE })}</p>
          <p className="text-xs">
            {t('footer.madeWith')}{" "}
            <a 
              href="https://x.com/kojima920" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @kojima920
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
