import React, { useState } from "react";

interface FloatingContactActionsProps {
  phoneNumber?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
}

export const FloatingContactActions: React.FC<FloatingContactActionsProps> = ({
  phoneNumber = "+918884446093",
  whatsappNumber = "918884446093",
  defaultMessage = "Hello Charla Living! I'm interested in knowing more about room availability, pricing, and scheduling a visit.",
}) => {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  // Clean whatsapp number (digits only)
  const cleanWaNumber = whatsappNumber.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodedMessage}`;
  const telUrl = `tel:${phoneNumber.replace(/\s+/g, "")}`;

  return (
    <aside 
      className="floating-contact-actions" 
      aria-label="Direct contact and chat options"
    >
      {/* WhatsApp Quick Chat Floating Button */}
      <div 
        className="floating-contact-item"
        onMouseEnter={() => setIsHovered("whatsapp")}
        onMouseLeave={() => setIsHovered(null)}
      >
        <div 
          className={`floating-contact-tooltip ${isHovered === "whatsapp" ? "is-visible" : ""}`}
          role="tooltip"
          id="tooltip-whatsapp"
        >
          <span>Chat on WhatsApp</span>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-btn--whatsapp"
          aria-label="Chat directly on WhatsApp with pre-drafted message"
          aria-describedby="tooltip-whatsapp"
        >
          {/* Subtle pulse animation ring */}
          <span className="floating-btn__pulse floating-btn__pulse--green" />
          
          <svg 
            className="floating-btn__icon" 
            viewBox="0 0 24 24" 
            width="28" 
            height="28" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.176.201-.301.301-.502.101-.201.05-.377-.025-.527-.075-.15-.678-1.633-.929-2.238-.244-.588-.493-.508-.678-.518l-.578-.01c-.201 0-.527.075-.803.377-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.912 1.23 3.113.15.201 2.123 3.242 5.144 4.547.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.579-.088 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.351z"/>
            <path d="M12.004 0C5.378 0 0 5.378 0 12.004c0 2.115.553 4.182 1.602 6.002L.055 23.945l6.096-1.599c1.764.962 3.753 1.47 5.853 1.47 6.626 0 12.004-5.378 12.004-12.004C24.008 5.378 18.63 0 12.004 0zm0 21.808c-1.85 0-3.664-.498-5.247-1.438l-.376-.223-3.896 1.022 1.04-3.797-.245-.39A9.78 9.78 0 0 1 2.208 12.004C2.208 6.599 6.599 2.208 12.004 2.208c5.405 0 9.796 4.391 9.796 9.796 0 5.405-4.391 9.804-9.796 9.804z"/>
          </svg>
        </a>
      </div>

      {/* Phone Direct Dial Floating Button */}
      <div 
        className="floating-contact-item"
        onMouseEnter={() => setIsHovered("phone")}
        onMouseLeave={() => setIsHovered(null)}
      >
        <div 
          className={`floating-contact-tooltip ${isHovered === "phone" ? "is-visible" : ""}`}
          role="tooltip"
          id="tooltip-phone"
        >
          <span>Call +91 88844 46093</span>
        </div>
        <a
          href={telUrl}
          className="floating-btn floating-btn--phone"
          aria-label="Directly call Charla Living at +91 88844 46093"
          aria-describedby="tooltip-phone"
        >
          <svg 
            className="floating-btn__icon" 
            viewBox="0 0 24 24" 
            width="24" 
            height="24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>
    </aside>
  );
};
