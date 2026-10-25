"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createNewLead } from "@/lib/db/actions";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { socialLinks } from "@/lib/content/about";
import { Reveal } from "@/components/ui/scroll-reveal";

const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Please enter a valid email address" }),
  description: z.string().nullable()
});

type ContactFormValues = z.infer<typeof contactSchema>;

const fieldClasses =
  "bg-transparent border-0 border-b border-zinc-700 dark:border-zinc-700 rounded-none px-0 py-3 text-base sm:text-lg text-white placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:border-amber-500 dark:focus-visible:border-amber-400 transition-colors font-sans w-full touch-manipulation";

const labelClasses =
  "sky-text-muted text-zinc-500 dark:text-zinc-500 uppercase tracking-wider text-xs font-sans mb-2 block";

type ContactProps = {
  /** Merged onto the section; the landing page clears its fill */
  className?: string;
};

const Contact = ({ className }: ContactProps) => {
  const t = useTranslations();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      description: null
    },
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);

    try {
      await createNewLead({
        name: data.name,
        email: data.email,
        description: data.description
      });

      setIsSubmitted(true);
      form.reset();
      toast.success(t("contact_form_success"));
    } catch (error) {
      console.error("Failed to submit lead:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className={cn(
        "contact-atmosphere isolate bg-black dark:bg-black py-10 sm:py-12 md:py-16 px-4 sm:px-6 overflow-x-hidden max-w-full",
        className
      )}
    >
      <div aria-hidden='true' className='contact-fx' />
      <div aria-hidden='true' className='contact-reels' />
      <div className='container mx-auto max-w-lg w-full'>
        <Reveal className='text-center space-y-2.5 sm:space-y-3 mb-8 sm:mb-10'>
          <Typography
            variant='caption1'
            className='text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-xs sm:text-sm font-sans block'
          >
            {t("contact_header")}
          </Typography>
          <Typography
            variant='h2'
            className='font-serif text-3xl sm:text-4xl text-white leading-tight'
          >
            {t("contact_heading")}
          </Typography>
          <Typography
            variant='body1'
            className='text-zinc-400 dark:text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed font-sans'
          >
            {t("contact_intro")}
          </Typography>
        </Reveal>

        <Reveal>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 sm:space-y-5'
              noValidate
            >
              {isSubmitted && (
                <div className='p-3 sm:p-4 rounded-lg bg-zinc-900 border border-zinc-800'>
                  <Typography
                    variant='body2'
                    className='text-zinc-300 dark:text-zinc-300 text-sm sm:text-base'
                  >
                    {t("contact_form_success")}
                  </Typography>
                </div>
              )}

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>
                      {t("contact_form_name_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={fieldClasses}
                        placeholder=''
                      />
                    </FormControl>
                    <FormMessage className='text-red-400 text-xs' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>
                      {t("contact_form_email_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='email'
                        className={fieldClasses}
                        placeholder=''
                        autoComplete='email'
                      />
                    </FormControl>
                    <FormMessage className='text-red-400 text-xs' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>
                      {t("contact_form_message_label")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        rows={4}
                        className={cn(
                          fieldClasses,
                          "py-2 resize-none min-h-[80px] sm:min-h-[100px]"
                        )}
                        placeholder=''
                      />
                    </FormControl>
                    <FormMessage className='text-red-400 text-xs' />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                disabled={isLoading}
                className={cn(
                  "w-full border-2 border-amber-500 dark:border-amber-400 bg-transparent hover:bg-amber-500/10 text-white font-sans uppercase tracking-wider text-sm sm:text-base py-5 sm:py-6 rounded-none transition-all min-h-[52px] touch-manipulation",
                  "hover:border-amber-400 dark:hover:border-amber-300 active:bg-amber-500/20"
                )}
              >
                {isLoading ? (
                  <span className='flex items-center gap-2'>
                    <span className='animate-spin'>⟳</span>
                    {t("contact_form_submit")}
                  </span>
                ) : (
                  t("contact_form_submit")
                )}
              </Button>
            </form>
          </Form>
        </Reveal>

        <Reveal className='flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 sm:mt-10'>
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className='sky-text-link text-zinc-500 dark:text-zinc-500 uppercase tracking-wider text-xs font-sans hover:text-amber-500 dark:hover:text-amber-400 transition-colors py-2 touch-manipulation'
            >
              {t(link.name)}
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
