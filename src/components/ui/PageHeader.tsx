interface PageHeaderProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
}

export default function PageHeader({ title, subtitle, bgImage }: PageHeaderProps) {
  return (
    <div className="relative bg-gray-900 py-8 md:py-12 overflow-hidden">
      {/* Background Image */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage} 
            alt={title} 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 uppercase tracking-tight animate-fade-in-up">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-100">
            {subtitle}
          </p>
        )}
        <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
      </div>
    </div>
  );
}
