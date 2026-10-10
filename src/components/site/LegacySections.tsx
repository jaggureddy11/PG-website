import { useState, type CSSProperties } from "react";
import { CommunityLogosMarquee } from "./CommunityLogosMarquee";
import { saveCallbackRequestToFirestore } from "@/lib/firebase";

export function LegacySections() {
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackLocality, setCallbackLocality] = useState("");
  const [isCallbackSubmitting, setIsCallbackSubmitting] = useState(false);
  const [isCallbackSubmitted, setIsCallbackSubmitted] = useState(false);

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName.trim() || !callbackPhone.trim() || !callbackLocality.trim()) return;
    setIsCallbackSubmitting(true);
    try {
      await saveCallbackRequestToFirestore({
        name: callbackName.trim(),
        phone: callbackPhone.trim(),
        locality: callbackLocality.trim(),
        source: "Homepage Callback Form",
        status: "new",
      });
    } catch (err) {
      console.warn("Could not save callback request to Firestore:", err);
    } finally {
      setIsCallbackSubmitting(false);
      setIsCallbackSubmitted(true);
    }
  };
  return (
    <>
<div>
  <section className="stats">
    <div className="container">
      <div className="stats__grid">
        <div className="stat" data-reveal>
          <span className="stat__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.8V21h14V9.8" /><path d="M10 21v-6h4v6" /></svg></span>
          <p className="stat__num"><span data-count={100}>0</span>%</p>
          <p className="stat__label">Consistent quality standard</p>
        </div>
        <div className="stat" data-reveal>
          <span className="stat__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx={9} cy={8} r="3.4" /><path d="M2.6 20c.8-3.5 3.4-5.2 6.4-5.2s5.6 1.7 6.4 5.2" /><circle cx="17.2" cy={9} r="2.6" /><path d="M15.8 15.1c2.6.4 4.6 1.9 5.4 4.6" /></svg></span>
          <p className="stat__num"><span data-count={150}>0</span>+</p>
          <p className="stat__label">Residents calling us home</p>
        </div>
        <div className="stat" data-reveal>
          <span className="stat__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
          <p className="stat__num"><span>24/7</span></p>
          <p className="stat__label">On-site manager & support</p>
        </div>
        <div className="stat" data-reveal>
          <span className="stat__icon stat__icon--star"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg></span>
          <p className="stat__num"><span data-count="4.8" data-decimal={1}>0</span></p>
          <p className="stat__label">Average Google rating</p>
        </div>
      </div>
    </div>
  </section>
  {/* ─── ALTERNATING STORY ZIGZAG SECTION (WITH FLOWING CONNECTING THREAD) ─── */}
  <section className="story-zigzag-section" id="stories">
    <div className="container">
      <div className="story-zigzag-wrap">
        {/* ─── Minimalist Orange Flowing Thread ─── */}
        <svg
          className="story-zigzag-thread-svg"
          viewBox="0 0 1200 2400"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="storyThreadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FB7009" />
              <stop offset="40%" stopColor="#FFA14A" />
              <stop offset="70%" stopColor="#FB7009" />
              <stop offset="100%" stopColor="#F95A00" />
            </linearGradient>
          </defs>

          {/* Subtle Sketched Dashed Guide Trail */}
          <path
            id="storyThreadTrack"
            className="story-thread-track"
            stroke="rgba(251, 112, 9, 0.2)"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
          />

          {/* Smooth Luminous Orange Active Sketched Thread */}
          <path
            id="storyThreadPath"
            className="story-thread-path"
            stroke="url(#storyThreadGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* ─── ROW 1 (Image Left, Text Right) ─── */}
        <div className="story-row story-row--left-img">
          <div className="story-collage">
            <div className="story-card story-card--tall">
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80" alt="Modern Charla Living residence building" />
            </div>
            <div className="story-card story-card--wide">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80" alt="Daily professional housekeeping and clean spaces" />
            </div>
          </div>

          <div className="story-content">
            <h2 className="story-title">
              Take your daily list of chores. And <span className="story-accent">tear it up</span>
            </h2>
            <p className="story-desc">
              You have better things to do than wash your clothes, clean up your room and cook your meals. Our team of in-house pros will do them all for you.
            </p>
          </div>
        </div>

        {/* ─── ROW 2 (Text Left, Image Right - ALTERNATING) ─── */}
        <div className="story-row story-row--right-img">
          <div className="story-content">
            <h2 className="story-title">
              Step into a room that has <span className="story-accent">room for everything</span>
            </h2>
            <p className="story-desc">
              Your clothes and bags won't be fighting for space on the same chair. Thoughtfully designed personal spaces with ample wardrobes, ergonomic desks, and peaceful sleep.
            </p>
          </div>

          <div className="story-collage story-collage--right">
            <div className="story-card story-card--tall">
              <img src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=700&q=80" alt="Spacious furnished bedroom with large wardrobe" />
            </div>
            <div className="story-card story-card--wide">
              <img src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=700&q=80" alt="Dedicated study work desk area" />
            </div>
          </div>
        </div>

        {/* ─── ROW 3 (Image Left, Text Right - ALTERNATING) ─── */}
        <div className="story-row story-row--left-img">
          <div className="story-collage">
            <div className="story-card story-card--tall">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80" alt="Bright and spacious cafeteria dining lounge" />
            </div>
            <div className="story-card story-card--wide">
              <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80" alt="Freshly cooked homestyle Indian meals" />
            </div>
          </div>

          <div className="story-content">
            <h2 className="story-title">
              Nutritious homestyle meals. Cooked <span className="story-accent">fresh daily</span>
            </h2>
            <p className="story-desc">
              No watery gravies or frozen supplies. Cooked fresh 4 times daily by dedicated kitchen teams with high-grade ingredients, weekly menu votes, and hot filter coffee whenever you need a recharge.
            </p>
          </div>
        </div>

        {/* ─── ROW 4 (Text Left, Image Right - ALTERNATING) ─── */}
        <div className="story-row story-row--right-img">
          <div className="story-content">
            <h2 className="story-title">
              Chill in common areas that are <span className="story-accent">anything but common</span>
            </h2>
            <p className="story-desc">
              Unwind on the breezy rooftop terrace, challenge flatmates to PlayStation tournaments, or catch live match screenings. A vibrant community where friends turn into family.
            </p>
          </div>

          <div className="story-collage story-collage--right">
            <div className="story-card story-card--tall">
              <img src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=80" alt="Rooftop evening celebration and lounge" />
            </div>
            <div className="story-card story-card--wide">
              <img src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=700&q=80" alt="Gaming console and entertainment zone" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <section className="how" id="how">
    <div className="container">
      <div className="section-head text-center" data-reveal>
        <h2 className="h2">From enquiry to keys in <em>72 hours.</em></h2>
        <p className="section-sub">A seamless, 3-step transition from browsing your next room to sleeping in it — with zero broker drama.</p>
      </div>

      <div className="how__steps">
        {/* Step 1 */}
        <div className="step" data-reveal>
          <div className="step__header">
            <span className="step__number">01</span>
            <span className="step__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5.6-7-10.8a7 7 0 0 1 14 0C19 15.4 12 21 12 21z" /><circle cx={12} cy={10} r="2.6" /></svg>
            </span>
          </div>
          <div className="step__media">
            <video
              className="step__video"
              src="/assets/step1-locality.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
          <h3>Pick your locality</h3>
          <p>Browse addresses across South Bengaluru, compare room sharing options, or simply tell us your office or college location.</p>
          <div className="step__footer">
            <span className="step__pill">Prime locations</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="step" data-reveal>
          <div className="step__header">
            <span className="step__number">02</span>
            <span className="step__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x={1} y={5} width={15} height={14} rx={2} /></svg>
            </span>
          </div>
          <div className="step__media">
            <video
              className="step__video"
              src="/assets/step2-walkthrough.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
          <h3>Take the free walkthrough</h3>
          <p>Visit in person or book a live HD video tour. See the exact room you'll get — same floor, same natural sunlight.</p>
          <div className="step__footer">
            <span className="step__pill">In-Person or Video</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="step" data-reveal>
          <div className="step__header">
            <span className="step__number">03</span>
            <span className="step__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="4.5" /><path d="M10.8 12.2 21 2m-3.5 3.5L21 9" /></svg>
            </span>
          </div>
          <div className="step__media">
            <video
              className="step__video"
              src="/assets/step3-movein.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
          <h3>Move in seamlessly</h3>
          <p>Sign a simple 1-page agreement, pay a 1-month deposit, and collect your keys. Hot dinner will be waiting for you that night.</p>
          <div className="step__footer">
            <span className="step__pill">Keys in 72h</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section className="stories" id="reviews">
    <div className="container section-head section-head--row stories__head" data-reveal>
      <div>
        <h2 className="h2">People stay <em>longer</em> here.</h2>
      </div>
      <aside className="stories__rating" aria-label="Rated 4.8 out of 5 from over 1,200 resident reviews">
        <span className="stories__rating-num">4.8</span>
        <span className="stories__rating-detail">
          <span className="stories__rating-stars" aria-hidden="true" style={{ display: "inline-flex", gap: "3px", alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#FB7009" stroke="#FB7009" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </span>
          <span className="stories__rating-copy">out of 5 · 1,200+ resident reviews</span>
        </span>
      </aside>
    </div>
    <div className="stories__marquee" data-reveal role="region" aria-label="Rolling resident feedback">
      <div className="stories__row stories__row--a">
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">The food is the reason I renewed. Hot rasam on a rainy day after a 10-hour shift — my mother approves of this PG, and she approves of nothing.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#003B99" } as CSSProperties}>AS</span>
            <div className="tcard__id"><strong>Ananya S.</strong><p>JP Nagar · 2 yrs · 5.0 Rating</p></div>
            <span className="tcard__tag">Food</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Wi-Fi never died once during my GATE prep, which is more than I can say for my last place. The owner personally fixed my geyser on a Sunday.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#FB7009" } as CSSProperties}>RV</span>
            <div className="tcard__id"><strong>Rohit V.</strong><p>Jayanagar · 14 mo · 5.0 Rating</p></div>
            <span className="tcard__tag">Wi-Fi</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">3-minute walk to class, laundry that comes back folded, and a strict no-nonsense guest policy. Exactly what a student needs, nothing he doesn't.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#B03A5B" } as CSSProperties}>AM</span>
            <div className="tcard__id"><strong>Arjun M.</strong><p>Kumaraswamy Layout · 8 mo · 4.8 Rating</p></div>
            <span className="tcard__tag">Walk to class</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Night-shift nurse, odd hours. They keep my dinner aside without my asking. That one small thing made me move my sister in too.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#7A5C3E" } as CSSProperties}>DR</span>
            <div className="tcard__id"><strong>Divya R.</strong><p>Uttarahalli · 1 yr · 5.0 Rating</p></div>
            <span className="tcard__tag">Night shift</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">My room is cleaned before I even notice it needs cleaning. Bedsheets changed twice a week, like clockwork, every single week.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#3E5F7A" } as CSSProperties}>SP</span>
            <div className="tcard__id"><strong>Sneha P.</strong><p>Uttarahalli · 1.5 yrs · 5.0 Rating</p></div>
            <span className="tcard__tag">Housekeeping</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">The food is the reason I renewed. Hot rasam on a rainy day after a 10-hour shift — my mother approves of this PG, and she approves of nothing.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#003B99" } as CSSProperties}>AS</span>
            <div className="tcard__id"><strong>Ananya S.</strong><p>JP Nagar · 2 yrs · 5.0 Rating</p></div>
            <span className="tcard__tag">Food</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Wi-Fi never died once during my GATE prep, which is more than I can say for my last place. The owner personally fixed my geyser on a Sunday.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#FB7009" } as CSSProperties}>RV</span>
            <div className="tcard__id"><strong>Rohit V.</strong><p>Jayanagar · 14 mo · 5.0 Rating</p></div>
            <span className="tcard__tag">Wi-Fi</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">3-minute walk to class, laundry that comes back folded, and a strict no-nonsense guest policy. Exactly what a student needs, nothing he doesn't.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#B03A5B" } as CSSProperties}>AM</span>
            <div className="tcard__id"><strong>Arjun M.</strong><p>Kumaraswamy Layout · 8 mo · 4.8 Rating</p></div>
            <span className="tcard__tag">Walk to class</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Night-shift nurse, odd hours. They keep my dinner aside without my asking. That one small thing made me move my sister in too.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#7A5C3E" } as CSSProperties}>DR</span>
            <div className="tcard__id"><strong>Divya R.</strong><p>Uttarahalli · 1 yr · 5.0 Rating</p></div>
            <span className="tcard__tag">Night shift</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">My room is cleaned before I even notice it needs cleaning. Bedsheets changed twice a week, like clockwork, every single week.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#3E5F7A" } as CSSProperties}>SP</span>
            <div className="tcard__id"><strong>Sneha P.</strong><p>Uttarahalli · 1.5 yrs · 5.0 Rating</p></div>
            <span className="tcard__tag">Housekeeping</span>
          </div>
        </article>
      </div>
      <div className="stories__row stories__row--b">
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Rooftop terrace is where half my team now does our sprint planning. Faster internet than office, and someone always refills the chai kettle.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#3E5F7A" } as CSSProperties}>KN</span>
            <div className="tcard__id"><strong>Karthik N.</strong><p>Padmanabhanagar · 10 mo · 5.0 Rating</p></div>
            <span className="tcard__tag">Rooftop</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Booked on Tuesday after a video tour, moved in on Friday. The room was exactly what they showed me — same view of the gulmohar tree outside.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#003B99" } as CSSProperties}>MT</span>
            <div className="tcard__id"><strong>Meghana T.</strong><p>Banashankari · 6 mo · 5.0 Rating</p></div>
            <span className="tcard__tag">Video tour</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Parents visited for one afternoon, approved the CCTV, the visitor log and the cook's sambhar in a single sitting. That's the review that matters.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#0E7C66" } as CSSProperties}>IK</span>
            <div className="tcard__id"><strong>Imran K.</strong><p>Jayanagar · 4 mo · 5.0 Rating</p></div>
            <span className="tcard__tag">Family-approved</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Two metro stops from the office and exactly zero landlord drama. I should have moved out of my old flat years ago, honestly.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#B03A5B" } as CSSProperties}>NR</span>
            <div className="tcard__id"><strong>Navya R.</strong><p>Padmanabhanagar · 9 mo · 4.8 Rating</p></div>
            <span className="tcard__tag">Working pro</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">The filter coffee at 7 a.m. is worth the rent by itself. Everything after that — the meals, the cleaning, the quiet — feels like a bonus.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#FB7009" } as CSSProperties}>VC</span>
            <div className="tcard__id"><strong>Vivek C.</strong><p>JP Nagar · 1 yr · 5.0 Rating</p></div>
            <span className="tcard__tag">Filter coffee</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Rooftop terrace is where half my team now does our sprint planning. Faster internet than office, and someone always refills the chai kettle.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#3E5F7A" } as CSSProperties}>KN</span>
            <div className="tcard__id"><strong>Karthik N.</strong><p>Padmanabhanagar · 10 mo · 5.0 Rating</p></div>
            <span className="tcard__tag">Rooftop</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Booked on Tuesday after a video tour, moved in on Friday. The room was exactly what they showed me — same view of the gulmohar tree outside.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#003B99" } as CSSProperties}>MT</span>
            <div className="tcard__id"><strong>Meghana T.</strong><p>Banashankari · 6 mo · 5.0 Rating</p></div>
            <span className="tcard__tag">Video tour</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Parents visited for one afternoon, approved the CCTV, the visitor log and the cook's sambhar in a single sitting. That's the review that matters.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#0E7C66" } as CSSProperties}>IK</span>
            <div className="tcard__id"><strong>Imran K.</strong><p>Jayanagar · 4 mo · 5.0 Rating</p></div>
            <span className="tcard__tag">Family-approved</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Two metro stops from the office and exactly zero landlord drama. I should have moved out of my old flat years ago, honestly.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#B03A5B" } as CSSProperties}>NR</span>
            <div className="tcard__id"><strong>Navya R.</strong><p>Padmanabhanagar · 9 mo · 4.8 Rating</p></div>
            <span className="tcard__tag">Working pro</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">The filter coffee at 7 a.m. is worth the rent by itself. Everything after that — the meals, the cleaning, the quiet — feels like a bonus.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#FB7009" } as CSSProperties}>VC</span>
            <div className="tcard__id"><strong>Vivek C.</strong><p>JP Nagar · 1 yr · 5.0 Rating</p></div>
            <span className="tcard__tag">Filter coffee</span>
          </div>
        </article>
      </div>
    </div>
  </section>
  <section className="faq" id="faq">
    <div className="container faq__grid">
      <div className="faq__intro" data-reveal>
        <h2 className="h2">Asked <em>every</em> week.</h2>
        <p className="section-sub">Straight answers, no fine print. For anything else, call us — a human picks up.</p>
        <a href="tel:+918884446093" className="btn btn--ghost">Talk to us</a>
      </div>
      <div className="faq__list">
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-rent" aria-expanded="false" aria-controls="faq-a-rent">
            <span>What does the monthly rent include?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-rent" role="region" aria-labelledby="faq-q-rent" aria-hidden="true"><p>Rent covers your furnished room, high-speed Wi-Fi, daily housekeeping, laundry machines, power backup and maintenance. Food plans are optional and billed separately at ₹3,200/month.</p></div>
        </div>
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-deposit" aria-expanded="false" aria-controls="faq-a-deposit">
            <span>Is there brokerage or a huge deposit?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-deposit" role="region" aria-labelledby="faq-q-deposit" aria-hidden="true"><p>Never any brokerage — you rent directly from the owner. We take one month's rent as a fully refundable deposit, returned within 7 days of vacating.</p></div>
        </div>
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-food" aria-expanded="false" aria-controls="faq-a-food">
            <span>How is the food, honestly?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-food" role="region" aria-labelledby="faq-q-food" aria-hidden="true"><p>Four meals a day, cooked fresh in-house by our own chefs. Rotating South and North Indian menus with veg and non-veg options, and a resident suggestion board that actually changes the menu.</p></div>
        </div>
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-lockin" aria-expanded="false" aria-controls="faq-a-lockin">
            <span>Is there a lock-in period?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-lockin" role="region" aria-labelledby="faq-q-lockin" aria-hidden="true"><p>Most rooms have no lock-in at all. Give us 30 days' notice and move out whenever life changes — the deposit still comes back in full.</p></div>
        </div>
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-safety" aria-expanded="false" aria-controls="faq-a-safety">
            <span>How safe are the residences?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-safety" role="region" aria-labelledby="faq-q-safety" aria-hidden="true"><p>Biometric entry, CCTV on all common areas, a night guard and a resident manager living on site. Guests sign in at the desk, and visiting hours end at 10 p.m.</p></div>
        </div>
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-visit" aria-expanded="false" aria-controls="faq-a-visit">
            <span>How do I schedule a visit?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-visit" role="region" aria-labelledby="faq-q-visit" aria-hidden="true"><p>Call or WhatsApp us on +91 88844 46093, or drop your number below. We host walkthroughs every day between 9 a.m. and 8 p.m. — video tours available if you're out of town.</p></div>
        </div>
      </div>
    </div>
  </section>

  {/* ─── OUR COMMUNITY / ROLLING INSTITUTION LOGOS ─── */}
  <CommunityLogosMarquee />

  <section className="visit" id="visit">
    <div className="container">
      <div className="visit__panel" data-reveal>
        <div className="visit__glow" aria-hidden="true" />
        <img className="visit__logo" src="/assets/logo.png" alt="Charla Living" width={180} height={120} data-reveal />
        <h2 className="visit__title" data-reveal>Your next home is closer than you think.<br />Come take a look.</h2>
        <p className="visit__sub" data-reveal>Leave your number and preferred locality. We'll call within 2 working hours and set up your walkthrough — zero pressure.</p>
        {!isCallbackSubmitted ? (
          <>
            <form className="visit__form" id="visitForm" onSubmit={handleCallbackSubmit} data-reveal>
              <div className="visit__field">
                <label htmlFor="visit-name">Your name</label>
                <input
                  id="visit-name"
                  type="text"
                  name="name"
                  placeholder="e.g. Ananya Rao"
                  autoComplete="name"
                  value={callbackName}
                  onChange={(e) => setCallbackName(e.target.value)}
                  required
                />
              </div>
              <div className="visit__field">
                <label htmlFor="visit-phone">Phone number</label>
                <input
                  id="visit-phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  inputMode="tel"
                  autoComplete="tel"
                  pattern="[0-9+ ]{10,14}"
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  required
                />
              </div>
              <div className="visit__field">
                <label htmlFor="visit-locality">Preferred locality</label>
                <select
                  id="visit-locality"
                  name="locality"
                  value={callbackLocality}
                  onChange={(e) => setCallbackLocality(e.target.value)}
                  required
                >
                  <option value="" disabled>Choose a locality</option>
                  <option>Kumaraswamy Layout</option>
                  <option>Uttarahalli</option>
                  <option>Banashankari</option>
                  <option>Padmanabhanagar</option>
                  <option>JP Nagar</option>
                  <option>Jayanagar</option>
                  <option>Not sure yet — guide me</option>
                </select>
              </div>
              <button type="submit" className="btn btn--orange" disabled={isCallbackSubmitting}>
                {isCallbackSubmitting ? "Requesting..." : "Request a callback"}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </form>
            <p className="visit__alt" data-reveal>Prefer talking? <a href="tel:+918884446093">+91 88844 46093</a> · Mon–Sun, 9 a.m.–8 p.m.</p>
          </>
        ) : (
          <div className="visit__success" id="visitSuccess" style={{ display: "block" }}>
            <span className="tick tick--lg" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
            <h3>Done. We'll call you shortly.</h3>
            <p>Keep your phone close — a real person from our team will reach out.</p>
            <a
              id="visitWhatsappLink"
              href={`https://wa.me/918884446093?text=${encodeURIComponent(
                `Hi Charla Living, I requested a callback on your website!\n• Name: ${callbackName}\n• Phone: ${callbackPhone}\n• Preferred Locality: ${callbackLocality}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--blue"
              style={{ marginTop: "14px", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <span>Message on WhatsApp for instant confirmation</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        )}
      </div>
    </div>
  </section>
</div>

    </>
  );
}
