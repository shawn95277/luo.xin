import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-semibold tracking-tight">luo.xin</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Hi, I&apos;m xin. Building things on the web.
        </p>
        <div className="flex justify-center">
          <Link href="/fitness" className={buttonVariants({ size: "lg" })}>
            训练计划
          </Link>
        </div>
      </div>
    </main>
  );
}
