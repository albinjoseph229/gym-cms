'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Correct hook for App Router params
import { Member } from '@/types';
import { Printer } from 'lucide-react';

// Since this is a client component, we need to unwrap params if we use props, 
// but useParams() is easier for client components.
// However, in App Router, page props are async.
// Let's assume we navigate here with ID.

// Actually, useParams might not work if the folder structure isn't [id].
// I'll create the page at src/app/admin/dashboard/members/[id]/card/page.tsx
// So params will have id.

import html2canvas from 'html2canvas';
import { Download, Share2 } from 'lucide-react';

export default function IDCardPage() {
  const params = useParams();
  const id = params?.id as string;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/members/search?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setMember(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleDownload = async () => {
    const cardElement = document.getElementById('id-card');
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null, // Transparent background if possible, or keeps card bg
        scale: 2, // Higher resolution
        useCORS: true, // For external images like UI Avatars
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${member?.fullName || 'member'}-id-card.png`;
      link.click();
    } catch (error) {
      console.error('Error generating card image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  const handleShare = async () => {
    const cardElement = document.getElementById('id-card');
    if (!cardElement || !member) return;

    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Try Web Share API with file
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'card.png', { type: 'image/png' })] })) {
          try {
            await navigator.share({
              files: [new File([blob], 'card.png', { type: 'image/png' })],
              title: 'Gym Membership Card',
              text: `Check out my membership card for ${member.fullName}!`,
            });
            return;
          } catch (shareError) {
            console.log('Share API failed or cancelled, falling back to WhatsApp link', shareError);
          }
        }

        // Fallback: Open WhatsApp with text
        const text = `Check out my Gym Membership Card!\nName: ${member.fullName}\nID: ${member.id}\nValid Until: ${member.planExpiryDate}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Try downloading instead.');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading card...</div>;
  if (!member) return <div className="p-8 text-white">Member not found</div>;

  const qrData = `https://oasisfitness.com/member?id=${member.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            z-index: 9999;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="mb-8 flex space-x-4 no-print">
        <button onClick={() => window.print()} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center transition-colors">
          <Printer className="w-5 h-5 mr-2" />
          Print
        </button>
        <button onClick={handleDownload} className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center transition-colors">
          <Download className="w-5 h-5 mr-2" />
          Download
        </button>
        <button onClick={handleShare} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg flex items-center transition-colors">
          <Share2 className="w-5 h-5 mr-2" />
          WhatsApp
        </button>
      </div>

      {/* ID Card Design */}
      <div id="print-area">
        <div 
          id="id-card" 
          className="w-[350px] h-[550px] rounded-2xl shadow-2xl overflow-hidden relative print:shadow-none print:border-black"
          style={{ 
            background: 'linear-gradient(135deg, #111827, #000000)',
            border: '1px solid #374151',
            color: '#ffffff'
          }}
        >
          {/* Header */}
          <div className="p-6 text-center" style={{ backgroundColor: '#ff4500' }}>
            <h2 className="text-2xl font-extrabold uppercase tracking-widest" style={{ color: '#ffffff' }}>OASIS</h2>
            <p className="text-xs font-bold tracking-widest opacity-80" style={{ color: '#ffffff' }}>FITNESS CLUB</p>
          </div>

          {/* Photo */}
          {/* Photo */}
          <div className="flex justify-center mt-4 relative z-10">
            <div className="w-32 h-32 rounded-full overflow-hidden" style={{ border: '4px solid #111827', backgroundColor: '#ffffff' }}>
               <img 
                 src={member.profilePhotoUrl || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzlDQTNBRiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTQuMmMtMi41IDAtNC43MS0xLjI4LTYtMy4yMi4wMy0xLjk5IDQtMy4wOCA2LTMuMDggMS45OSAwIDUuOTcgMS4wOSA2IDMuMDgtMS4yOSAxLjk0LTMuNSAzLjIyLTYgMy4yMnoiLz48L3N2Zz4='} 
                 alt={member.fullName} 
                 className="w-full h-full object-cover"
                 crossOrigin="anonymous"
                 onError={(e) => {
                   e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzlDQTNBRiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTQuMmMtMi41IDAtNC43MS0xLjI4LTYtMy4yMi4wMy0xLjk5IDQtMy4wOCA2LTMuMDggMS45OSAwIDUuOTcgMS4wOSA2IDMuMDgtMS4yOSAxLjk0LTMuNSAzLjIyLTYgMy4yMnoiLz48L3N2Zz4=';
                 }}
               />
            </div>
          </div>

          {/* Details */}
          <div className="text-center mt-4 px-6">
            <h3 className="text-xl font-bold mb-1" style={{ color: '#ffffff' }}>{member.fullName}</h3>
            <p className="text-sm font-bold uppercase" style={{ color: '#ff4500' }}>{member.currentPlan}</p>
            
            <div className="mt-6 space-y-3 text-sm" style={{ color: '#9ca3af' }}>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid #1f2937' }}>
                <span>Member ID</span>
                <span className="font-mono" style={{ color: '#ffffff' }}>{member.id}</span>
              </div>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid #1f2937' }}>
                <span>Branch</span>
                <span style={{ color: '#ffffff' }}>{member.branchName}</span>
              </div>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid #1f2937' }}>
                <span>Valid Until</span>
                <span style={{ color: '#ffffff' }}>{member.planExpiryDate}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="absolute bottom-0 w-full p-4 flex flex-col items-center" style={{ backgroundColor: '#ffffff' }}>
            <img src={qrUrl} alt="QR Code" className="w-24 h-24 mb-2" crossOrigin="anonymous" />
            <p className="text-xs font-bold" style={{ color: '#000000' }}>SCAN TO VERIFY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
