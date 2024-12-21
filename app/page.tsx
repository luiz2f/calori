import LandingActionButtons from "@/components/by-page/landing/LandingActionButtons";
import Logo from "@/components/ui/Logo";

export default function Home() {


  return (
    <main className=" flex items-center  flex-col flex-grow h-full">
      <div className="w-full grid grid-rows-[100px_1fr]  h-full">
        <div className="text-3xl self-center text-center ">
          <Logo />
        </div>
        <div className="flex flex-col justify-between mt-8 ">
          <div>
            <div className="text-4xl self-center px-6 mt-2 mb-4">
              <div className="font-semibold">
                Sua nova forma <br /> de pensar dieta
              </div>
              <p className="text-sm">
                Tudo para organizar sua dieta no seu ritmo.
              </p>
            </div>
            <div className="h-48">
              <img src="landing_beta.jpg" />
            </div>
          </div>

          <LandingActionButtons />
        </div>
      </div>
    </main>
  );
}
