const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
);

const EmailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Footer = () => {
    return (
        <footer className="w-full mt-auto pt-4">
            <div className="bg-white/95 rounded-2xl shadow-sm border-t border-gray-200 px-6 py-4">
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
                    <a
                        href="https://wa.me/5588992333900?text=Olá!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <WhatsAppIcon />
                        <span className="font-medium">(88) 99233-3900</span>
                    </a>

                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=necicorreialima@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <InstagramIcon />
                        <span className="font-medium">@neci_lima</span>
                    </a>

                    <p className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:underline transition-colors break-all">
                        <EmailIcon />
                        <span className="font-medium">necicorreialima@gmail.com</span>
                    </p>
                </div>

                <p className="mt-3 pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
                    © 2026 Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
}
