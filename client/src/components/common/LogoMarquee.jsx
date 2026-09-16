import React from 'react';
import { resolveMediaUrl } from '../../utils/mediaResolver';

/**
 * LogoMarquee — continuously scrolling brand-logo strip used on the About
 * page under the "Trusted by Leading Enterprise Brands" heading.
 *
 * Design notes (extension, not redesign):
 * - Follows the site's light design language (#f1f9ff surface brand cards,
 *   brand-blue hover accents — same tokens as the rest of the About page).
 * - Infinite loop via the duplicated-track technique (track renders the logo
 *   list twice and animates to -50%), mirroring the existing trust-bar
 *   marquee pattern used elsewhere in the project.
 * - Pauses on hover (animation-play-state), resumes smoothly on leave.
 * - Honors prefers-reduced-motion.
 * - Fully CMS-driven: logos, order, visibility, and speed come from the
 *   About page CMS data (aboutDefaults → draft → publish pipeline).
 *
 * Expected data shape (all fields optional / backward compatible):
 * {
 *   enabled: true,          // master on/off switch
 *   speedSeconds: 35,       // full-loop duration (larger = slower)
 *   logos: [
 *     { id, name, imageUrl, enabled },  // imageUrl = media library/upload URL
 *   ],
 * }
 */

export const LogoMarquee = ({ data = {} }) => {
  const enabled = data?.enabled !== false;
  const speedSeconds = Number(data?.speedSeconds) > 0 ? Number(data.speedSeconds) : 35;
  const logos = (Array.isArray(data?.logos) ? data.logos : [])
    .filter((l) => l && l.enabled !== false && l.imageUrl);

  if (!enabled || logos.length === 0) return null;

  // Duplicate the list for the seamless -50% loop. Two full copies always
  // cover the widest viewport; keying by index+copy avoids duplicate keys.
  const track = [...logos, ...logos];

  return (
    <section className="py-10 sm:py-12 bg-white border-b border-sky-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-[#6e6e6e] uppercase tracking-widest">
            {data?.heading || 'Trusted by Leading Enterprise Brands'}
          </span>
        </div>

        {/* Edge fade masks keep the scroll feeling contained and premium */}
        <div className="logo-marquee-window relative">
          <div
            className="logo-marquee-track flex items-center gap-4 sm:gap-6 w-max"
            style={{ animationDuration: `${speedSeconds}s` }}
          >
            {track.map((logo, idx) => (
              <div
                key={`${logo.id || logo.name || 'logo'}-${idx}`}
                className="logo-marquee-card shrink-0 flex items-center justify-center h-16 sm:h-20 w-36 sm:w-44 px-4 rounded-2xl bg-white border border-[#e5e7eb] shadow-xs"
                title={logo.name || ''}
              >
                <img
                  src={resolveMediaUrl(logo.imageUrl)}
                  alt={logo.name || 'Client logo'}
                  loading="lazy"
                  draggable="false"
                  className="max-h-10 sm:max-h-12 max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;
