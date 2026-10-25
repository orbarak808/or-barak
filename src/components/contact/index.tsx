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
import { SectionHeading } from "@/components/home/section-heading";

const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Please enter a valid email address" }),
  description: z.string().nullable()
});

type ContactFormValues = z.infer<typeof contactSchema>;

const fieldClasses =
  "bg-transparent dark:bg-transparent border-0 border-b border-[#6B6255] dark:border-[#6B6255] rounded-none px-0 py-3 text-[17px] text-[#EDE6D8] placeholder:text-[#8F887C] focus-visible:ring-0 focus-visible:border-[#D4AF37] dark:focus-visible:border-[#D4AF37] transition-colors font-sans w-full touch-manipulation";

const labelClasses =
  "text-[#A39B8D] dark:text-[#A39B8D] uppercase tracking-[0.14em] text-xs font-semibold font-sans mb-2 block";

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
      <div aria-hidden='true' className='contact-reels' />
      <div className='container mx-auto max-w-lg w-full'>
        <div className='mb-10 space-y-5 text-center'>
          <SectionHeading
            align='center'
            eyebrow={t("contact_header")}
            title={t("contact_heading")}
          />
          <Reveal>
            <p className='text-[17px] leading-[1.65] text-[#B5AD9F]'>
              {t("contact_intro")}
            </p>
          </Reveal>
        </div>

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
                  "w-full border border-[#D4AF37] dark:border-[#D4AF37] bg-transparent dark:bg-transparent hover:bg-[#D4AF37]/10 dark:hover:bg-[#D4AF37]/10 text-[#EDE6D8] font-sans text-[13px] font-semibold uppercase tracking-[0.22em] py-5 sm:py-6 rounded-none transition-colors min-h-[52px] touch-manipulation",
                  "active:bg-[#D4AF37]/20"
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
              className='text-[#B5AD9F] dark:text-[#B5AD9F] uppercase tracking-[0.14em] text-[13px] font-sans hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors py-2 touch-manipulation'
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
