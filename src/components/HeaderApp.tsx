import Logo from "../../public/logo.png";

export const HeaderApp = () => {
    return (
        <div className="-mb-6 z-10">
            <img
                className="w-28 md:w-32 rounded-full shadow-lg animate-bounce duration-1000 border-2 border-white"
                src={Logo}
                alt="Logo da aplicação" />
        </div>
    );
}