"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { ShieldCheck, Droplet, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SuperAdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(AUTH_ROUTES.SUPER_ADMIN_VERIFICATION);
    }, 1200);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <main className="min-h-screen bg-(--color-text-primary) w-full flex items-center justify-center p-0 sm:p-6 md:p-12">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl flex flex-col justify-center min-h-[600px] my-auto">
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 pt-10 pb-4">
          {/* Logo on dark */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Droplet size={22} fill="currentColor" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              LifeLink
            </span>
            <div className="ml-auto px-2.5 py-1 rounded-full bg-white/10 text-white/60 text-[10px] font-semibold uppercase tracking-widest">
              Restricted
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                Authorized Access Only
              </p>
              <h1 className="text-2xl font-extrabold text-white leading-tight">
                Super Admin Login
              </h1>
              <p className="text-white/50 text-sm mt-1">
                This portal is restricted to pre-provisioned administrators.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-white/60">
                  Email address
                </label>
                <div className="flex items-center border-2 border-white/10 rounded-2xl bg-white/5 focus-within:border-white/30 transition-colors">
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="admin@lifelink.ng"
                    className="flex-1 px-4 py-3.5 text-base text-white placeholder:text-white/25 bg-transparent outline-none min-h-14"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-white/60">
                  Password
                </label>
                <div className="flex items-center border-2 border-white/10 rounded-2xl bg-white/5 focus-within:border-white/30 transition-colors">
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className="flex-1 px-4 py-3.5 text-base text-white placeholder:text-white/30 bg-transparent outline-none min-h-14"
                  />
                </div>
              </div>

              {hasErrors && (
                <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/30">
                  <p className="text-sm text-red-400 font-medium">
                    Enter your administrator credentials.
                  </p>
                </div>
              )}
            </div>

            {/* Security notice */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 mt-4">
              <div className="flex items-center gap-2 text-white/50">
                <ShieldCheck size={14} />
                <p className="text-xs font-semibold uppercase tracking-wide">
                  Security notice
                </p>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                All login attempts are logged and monitored. Unauthorized access
                is prohibited. If you are not an authorized Super Admin, please
                leave this page.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-8 pb-6 pt-3 space-y-3 flex-shrink-0">
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-white text-(--color-text-primary) font-bold text-base py-4 rounded-2xl hover:bg-white/90 transition-colors disabled:opacity-50 min-h-[52px] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating…
              </>
            ) : (
              "Log in"
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
