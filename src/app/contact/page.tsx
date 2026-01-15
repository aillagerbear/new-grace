"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 추후 실제 API 연동
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              문의하기
            </h1>
            <p className="text-muted-foreground text-sm">
              궁금한 점이 있으시면 언제든 문의해주세요
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">전화 문의</h3>
                  <p className="text-sm text-muted-foreground">02-123-4567</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">이메일</h3>
                  <p className="text-sm text-muted-foreground">contact@church.com</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">주소</h3>
                  <p className="text-sm text-muted-foreground">
                    서울시 강남구 테헤란로 123
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">운영 시간</h3>
                  <p className="text-sm text-muted-foreground">
                    평일 09:00 - 18:00
                  </p>
                  <p className="text-sm text-muted-foreground">
                    주일 07:00 - 15:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {isSubmitted ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-emerald-500/10">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  문의가 접수되었습니다
                </h2>
                <p className="text-muted-foreground mb-6">
                  빠른 시일 내에 답변드리겠습니다.
                  <br />
                  감사합니다.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 border border-border rounded-xl hover:bg-secondary transition-colors"
                >
                  새 문의하기
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        이메일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="이메일을 입력하세요"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      문의 유형 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="">선택해주세요</option>
                      <option value="general">일반 문의</option>
                      <option value="service">서비스 이용 문의</option>
                      <option value="suggestion">건의사항</option>
                      <option value="bug">오류 신고</option>
                      <option value="other">기타</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      문의 내용 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                      placeholder="문의 내용을 입력하세요"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    문의하기
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
