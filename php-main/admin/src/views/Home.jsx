import React, { useState, useEffect } from 'react';
import { Save, UploadCloud, Film, CheckCircle2, Link2, Type, FileText, Plus, X, Image as ImageIcon, Layers, Edit, Trash2, Shield, Check, Star } from 'lucide-react';
import { fetchHeroConfig, updateHeroConfig, fetchSection2Config, updateSection2Config, fetchSection3Config, updateSection3Config, fetchSection4Config, updateSection4Config, fetchSection5Config, updateSection5Config, fetchSection6Config, updateSection6Config, fetchPartnerConfig, updatePartnerConfig, fetchStatsConfig, updateStatsConfig, fetchAboutConfig, updateAboutConfig } from '../services/api';
import MarqueeEditor from './MarqueeEditor';

export default function Home({ onShowToast }) {
  // ==========================================
  // SECTION 1: HERO SECTION STATE
  // ==========================================
  const [title, setTitle] = useState('Welcome to Unise');
  const [heading, setHeading] = useState("UAE's Trusted Security Systems Partner");
  const [description, setDescription] = useState(
    'Protecting businesses, assets, and people across Dubai, Abu Dhabi, Sharjah, and the UAE — with world-class physical security infrastructure, expert engineers, and zero-compromise service.'
  );

  const [words, setWords] = useState(["Design.", "Supply.", "Installation.", "Maintenance."]);
  const [newWord, setNewWord] = useState('');

  const [button1Text, setButton1Text] = useState('Request a Free Site Survey');
  const [button1Link, setButton1Link] = useState('/contact-us');
  const [button2Text, setButton2Text] = useState('Call Us Now: +971 50 288 5874');
  const [button2Link, setButton2Link] = useState('tel:+971502885874');

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [videoBase64, setVideoBase64] = useState('');
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [loadingHero, setLoadingHero] = useState(true);
  const [isSavingHero, setIsSavingHero] = useState(false);

  // ==========================================
  // SECTION 2: ABOUT / ECOSYSTEM SECTION STATE
  // ==========================================
  const [sec2Title, setSec2Title] = useState('Pioneering the Future of Secured Intelligence');
  const [sec2Heading, setSec2Heading] = useState('Next-Gen Architecture');
  const [sec2Description, setSec2Description] = useState(
    'UniSpark Innovation architectures orchestrate friction-free continuous analysis across critical enterprise vectors, neutralizing vulnerabilities before they cross your network perimeter.'
  );

  const [card1Title, setCard1Title] = useState('Cognitive Shielding');
  const [card1Desc, setCard1Desc] = useState('Self-learning neural vectors adapt instantly to network threats.');

  const [card2Title, setCard2Title] = useState('Microsecond Latency');
  const [card2Desc, setCard2Desc] = useState('Sub-atomic detection layers processing continuous data streams.');

  const [ecoBtnText, setEcoBtnText] = useState('Our Ecosystem');
  const [ecoBtnLink, setEcoBtnLink] = useState('/about-us');

  const [sec2ImageFile, setSec2ImageFile] = useState(null);
  const [sec2ImagePreviewUrl, setSec2ImagePreviewUrl] = useState('');
  const [sec2ImageBase64, setSec2ImageBase64] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const [imgBtnText, setImgBtnText] = useState('99.99% Threat Isolation');
  const [imgBtnLink, setImgBtnLink] = useState('/solutions');

  const [loadingSec2, setLoadingSec2] = useState(true);
  const [isSavingSec2, setIsSavingSec2] = useState(false);

  // ==========================================
  // SECTION 3: SERVICES SECTION STATE
  // ==========================================
  const [sec3BadgeText, setSec3BadgeText] = useState('WHAT WE DO');
  const [sec3MainHeading, setSec3MainHeading] = useState('End-to-End Physical Security Solutions');
  const [sec3Description, setSec3Description] = useState(
    'From initial site survey and system design through to professional installation, commissioning, and long-term maintenance — UniSpark delivers complete security infrastructure for every environment.'
  );

  const [sec3ViewAllBtnText, setSec3ViewAllBtnText] = useState('View All Services');
  const [sec3ViewAllBtnLink, setSec3ViewAllBtnLink] = useState('/solutions');

  const [servicesList, setServicesList] = useState([
    {
      id: 'cctv-and-ip-camera-systems',
      title: 'CCTV & IP Camera Systems',
      icon: 'fa-video',
      iconUrl: '',
      desc: 'HD surveillance, remote monitoring, and smart analytics for complete site visibility.',
      featured: true
    },
    {
      id: 'access-control-systems',
      title: 'Access Control Systems',
      icon: 'fa-id-card-clip',
      iconUrl: '',
      desc: 'Card, biometric, and multi-factor access control for every door, gate, and perimeter.',
      featured: true
    },
    {
      id: 'intruder-alarm-and-detection-systems',
      title: 'Intruder Alarm & Detection',
      icon: 'fa-bell',
      iconUrl: '',
      desc: 'Motion, vibration, and perimeter detection systems connected to central monitoring.',
      featured: false
    },
    {
      id: 'fire-alarm-and-detection-systems',
      title: 'Fire Alarm & Detection',
      icon: 'fa-fire-extinguisher',
      iconUrl: '',
      desc: 'UAE Civil Defence-compliant fire detection and alarm systems for all building types.',
      featured: false
    },
    {
      id: 'biometric-and-smart-security-systems',
      title: 'Biometric & Smart Security',
      icon: 'fa-fingerprint',
      iconUrl: '',
      desc: 'Fingerprint, face recognition, and iris scan systems integrated with HR and payroll.',
      featured: false
    },
    {
      id: 'system-integration-and-control-room-setup',
      title: 'System Integration & Control Room Setup',
      icon: 'fa-display',
      iconUrl: '',
      desc: 'Unified security management platforms, SOC design, and video walls.',
      featured: true
    }
  ]);

  const [loadingSec3, setLoadingSec3] = useState(true);
  const [isSavingSec3, setIsSavingSec3] = useState(false);

  // ==========================================
  // SECTION 4: DIVISIONS SECTION STATE
  // ==========================================
  const [sec4Title, setSec4Title] = useState('Our Two Divisions');
  const [sec4Heading, setSec4Heading] = useState('One Partner. Two Specialist Divisions.');
  const [sec4Cards, setSec4Cards] = useState([
    {
      id: 'div-1',
      title: 'Installation & Maintenance',
      description: 'Professional design, supply, installation, commissioning, and AMC/PMC services across all physical security systems. SLA-governed, UAE-wide coverage.',
      icon: 'fa-screwdriver-wrench',
      buttonText: 'Explore Installation Services',
      buttonLink: '/solutions'
    },
    {
      id: 'div-2',
      title: 'Security Equipment Trading',
      description: 'Supply of globally-recognised security hardware — cameras, recorders, access control, alarm panels, biometric devices, cabling — with UAE stock for fast delivery.',
      icon: 'fa-truck-ramp-box',
      buttonText: 'Request a Survey',
      buttonLink: '/contact-us'
    }
  ]);
  const [loadingSec4, setLoadingSec4] = useState(true);
  const [isSavingSec4, setIsSavingSec4] = useState(false);

  // Section 4 Modal State
  const [showSec4Modal, setShowSec4Modal] = useState(false);
  const [editingSec4Id, setEditingSec4Id] = useState(null);
  const [sec4ModalTitle, setSec4ModalTitle] = useState('');
  const [sec4ModalDesc, setSec4ModalDesc] = useState('');
  const [sec4ModalIcon, setSec4ModalIcon] = useState('');
  const [sec4ModalBtnText, setSec4ModalBtnText] = useState('');
  const [sec4ModalBtnLink, setSec4ModalBtnLink] = useState('');

  // ==========================================
  // SECTION 5: INDUSTRIES SECTION STATE
  // ==========================================
  const [sec5Title, setSec5Title] = useState('INDUSTRIES WE SERVE');
  const [sec5Heading, setSec5Heading] = useState('Security Solutions Built for Your Sector');
  const [sec5Description, setSec5Description] = useState('Deploying custom, advanced cyber-security, monitoring, and automated safety matrices engineered for enterprise ecosystems.');
  const [sec5Cards, setSec5Cards] = useState([
    {
      id: 'ind-1',
      title: 'Commercial',
      subtitle: 'Corporate offices, retail chains, and business centers.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
      link: '/industries/commercial'
    }
  ]);
  const [loadingSec5, setLoadingSec5] = useState(true);
  const [isSavingSec5, setIsSavingSec5] = useState(false);

  // Section 5 Modal State
  const [showSec5Modal, setShowSec5Modal] = useState(false);
  const [editingSec5Id, setEditingSec5Id] = useState(null);
  const [sec5ModalTitle, setSec5ModalTitle] = useState('');
  const [sec5ModalDesc, setSec5ModalDesc] = useState('');
  const [sec5ModalImageFile, setSec5ModalImageFile] = useState(null);
  const [sec5ModalImagePreviewUrl, setSec5ModalImagePreviewUrl] = useState('');
  const [sec5ModalImageBase64, setSec5ModalImageBase64] = useState('');
  const [sec5ModalBtnLink, setSec5ModalBtnLink] = useState('');

  // ==========================================
  // SECTION 6: WHY US SECTION STATE
  // ==========================================
  const [sec6Title, setSec6Title] = useState('WHY CHOOSE UNISPARK');
  const [sec6Heading, setSec6Heading] = useState('Technical Authority. Trusted Delivery.');
  const [sec6Description, setSec6Description] = useState('We combine regulatory expertise, multi-vendor technology integration, and lifecycle ownership to keep your critical assets protected.');
  const [sec6ButtonText, setSec6ButtonText] = useState('View All Services');
  const [sec6ButtonLink, setSec6ButtonLink] = useState('/solutions');
  const [sec6Cards, setSec6Cards] = useState([
    {
      id: 'why-1',
      title: 'UAE Regulatory Compliance',
      description: 'All systems designed and installed in accordance with UAE Civil Defence, NESA, and DESC standards.',
      icon: 'fa-building-shield'
    }
  ]);
  const [loadingSec6, setLoadingSec6] = useState(true);
  const [isSavingSec6, setIsSavingSec6] = useState(false);

  // Section 6 Modal State
  const [showSec6Modal, setShowSec6Modal] = useState(false);
  const [editingSec6Id, setEditingSec6Id] = useState(null);
  const [sec6ModalTitle, setSec6ModalTitle] = useState('');
  const [sec6ModalDesc, setSec6ModalDesc] = useState('');
  const [sec6ModalIcon, setSec6ModalIcon] = useState('');
  const [sec6ModalImageFile, setSec6ModalImageFile] = useState(null);
  const [sec6ModalImagePreviewUrl, setSec6ModalImagePreviewUrl] = useState('');
  const [sec6ModalImageBase64, setSec6ModalImageBase64] = useState('');

  // ==========================================
  // SECTION 7: PARTNERS SECTION STATE
  // ==========================================
  const [sec7Badge, setSec7Badge] = useState('GLOBAL ALLIANCE');
  const [sec7Heading, setSec7Heading] = useState("Powered by the World's Leading Security Brands");
  const [sec7IsVisible, setSec7IsVisible] = useState(true);
  const [sec7BgColor, setSec7BgColor] = useState('#ffffff');
  const [sec7Speed, setSec7Speed] = useState(25);
  const [partnersList, setPartnersList] = useState([]);
  const [loadingSec7, setLoadingSec7] = useState(true);
  const [isSavingSec7, setIsSavingSec7] = useState(false);

  // Section 7 Modal State
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [partnerModalName, setPartnerModalName] = useState('');
  const [partnerModalLogoPreviewUrl, setPartnerModalLogoPreviewUrl] = useState('');
  const [partnerModalLogoBase64, setPartnerModalLogoBase64] = useState('');
  const [partnerModalLink, setPartnerModalLink] = useState('');

  // ==========================================
  // SECTION 8: STATS SECTION STATE
  // ==========================================
  const [statsList, setStatsList] = useState([]);
  const [loadingSec8, setLoadingSec8] = useState(true);
  const [isSavingSec8, setIsSavingSec8] = useState(false);

  // Section 8 Modal State
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingStatsId, setEditingStatsId] = useState(null);
  const [statsModalTitle, setStatsModalTitle] = useState('');
  const [statsModalSubtitle, setStatsModalSubtitle] = useState('');
  const [statsModalCaption, setStatsModalCaption] = useState('');
  const [statsModalIcon, setStatsModalIcon] = useState('MapPin');

  // ==========================================
  // SECTION 9: OUR GROUP STRUCTURE STATE
  // ==========================================
  const [fullAboutDoc, setFullAboutDoc] = useState(null);
  const [sec9GroupBadge, setSec9GroupBadge] = useState('CORPORATE ARCHITECTURE');
  const [sec9GroupTitle, setSec9GroupTitle] = useState('OUR GROUP STRUCTURE');
  const [sec9GroupDesc, setSec9GroupDesc] = useState('');
  const [sec9GroupCards, setSec9GroupCards] = useState([]);
  const [isSavingSec9, setIsSavingSec9] = useState(false);

  // Section 9 Modal State
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [groupModalTag, setGroupModalTag] = useState('');
  const [groupModalTitle, setGroupModalTitle] = useState('');
  const [groupModalSubtitle, setGroupModalSubtitle] = useState('Core Business:');
  const [groupModalTagsInput, setGroupModalTagsInput] = useState('');
  const [groupModalIcon, setGroupModalIcon] = useState('Building2');
  const [groupModalLink, setGroupModalLink] = useState('');
  const [groupModalDisclaimer, setGroupModalDisclaimer] = useState('');

  // ==========================================
  // SECTION 10: FUTURISTIC CTA STATE
  // ==========================================
  const [sec10CtaBadge, setSec10CtaBadge] = useState('NEXT-GEN INTEGRATION');
  const [sec10CtaTitle, setSec10CtaTitle] = useState("Let's Discuss Your Security Requirements");
  const [sec10CtaDesc, setSec10CtaDesc] = useState('');
  const [sec10PrimaryBtnText, setSec10PrimaryBtnText] = useState('Request a Free Site Survey');
  const [sec10PrimaryBtnLink, setSec10PrimaryBtnLink] = useState('/contact-us');
  const [sec10SecondaryBtnText, setSec10SecondaryBtnText] = useState('Download Company Profile');
  const [sec10SecondaryBtnLink, setSec10SecondaryBtnLink] = useState('/company-profile.pdf');
  const [sec10CtaBgPreviewUrl, setSec10CtaBgPreviewUrl] = useState('');
  const [sec10CtaBgBase64, setSec10CtaBgBase64] = useState('');
  const [isSavingSec10, setIsSavingSec10] = useState(false);

  // Service Add / Edit Modal state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceModalTitle, setServiceModalTitle] = useState('');
  const [serviceModalDesc, setServiceModalDesc] = useState('');
  const [serviceModalIcon, setServiceModalIcon] = useState('fa-video');
  const [serviceModalIconUrl, setServiceModalIconUrl] = useState('');
  const [serviceModalIconBase64, setServiceModalIconBase64] = useState('');
  const [serviceModalFeatured, setServiceModalFeatured] = useState(false);

  // Load Hero Section 1 data
  const loadHeroData = async () => {
    setLoadingHero(true);
    const res = await fetchHeroConfig();
    if (res.success && res.data) {
      setTitle(res.data.title || 'Welcome to Unise');
      setHeading(res.data.heading || "UAE's Trusted Security Systems Partner");
      if (Array.isArray(res.data.words) && res.data.words.length > 0) {
        setWords(res.data.words);
      }
      setDescription(res.data.description || '');
      if (res.data.button1) {
        setButton1Text(res.data.button1.text || 'Request a Free Site Survey');
        setButton1Link(res.data.button1.link || '/contact-us');
      }
      if (res.data.button2) {
        setButton2Text(res.data.button2.text || 'Call Us Now: +971 50 288 5874');
        setButton2Link(res.data.button2.link || 'tel:+971502885874');
      }
      if (res.data.videoUrl) {
        setVideoPreviewUrl(res.data.videoUrl);
      }
    }
    setLoadingHero(false);
  };

  // Load Section 2 data
  const loadSection2Data = async () => {
    setLoadingSec2(true);
    const res = await fetchSection2Config();
    if (res.success && res.data) {
      setSec2Title(res.data.title || 'Pioneering the Future of Secured Intelligence');
      setSec2Heading(res.data.heading || 'Next-Gen Architecture');
      setSec2Description(res.data.description || '');
      if (res.data.card1) {
        setCard1Title(res.data.card1.title || 'Cognitive Shielding');
        setCard1Desc(res.data.card1.description || 'Self-learning neural vectors...');
      }
      if (res.data.card2) {
        setCard2Title(res.data.card2.title || 'Microsecond Latency');
        setCard2Desc(res.data.card2.description || 'Sub-atomic detection layers...');
      }
      if (res.data.ecosystemButton) {
        setEcoBtnText(res.data.ecosystemButton.text || 'Our Ecosystem');
        setEcoBtnLink(res.data.ecosystemButton.link || '/about-us');
      }
      if (res.data.imageUrl) {
        setSec2ImagePreviewUrl(res.data.imageUrl);
      }
      if (res.data.imageButton) {
        setImgBtnText(res.data.imageButton.text || '99.99% Threat Isolation');
        setImgBtnLink(res.data.imageButton.link || '/solutions');
      }
    }
    setLoadingSec2(false);
  };

  // Load Section 3 data
  const loadSection3Data = async () => {
    setLoadingSec3(true);
    const res = await fetchSection3Config();
    if (res.success && res.data) {
      setSec3BadgeText(res.data.badgeText || 'WHAT WE DO');
      setSec3MainHeading(res.data.mainHeading || 'End-to-End Physical Security Solutions');
      setSec3Description(res.data.description || '');
      if (res.data.viewAllButton) {
        setSec3ViewAllBtnText(res.data.viewAllButton.text || 'View All Services');
        setSec3ViewAllBtnLink(res.data.viewAllButton.link || '/solutions');
      }
      if (Array.isArray(res.data.services) && res.data.services.length > 0) {
        setServicesList(res.data.services);
      }
    }
    setLoadingSec3(false);
  };

  // Load Section 4 data
  const loadSection4Data = async () => {
    setLoadingSec4(true);
    const res = await fetchSection4Config();
    if (res.success && res.data) {
      setSec4Title(res.data.title || 'Our Two Divisions');
      setSec4Heading(res.data.heading || 'One Partner. Two Specialist Divisions.');
      if (Array.isArray(res.data.cards) && res.data.cards.length > 0) {
        setSec4Cards(res.data.cards);
      }
    }
    setLoadingSec4(false);
  };

  // Load Section 5 data
  const loadSection5Data = async () => {
    setLoadingSec5(true);
    const res = await fetchSection5Config();
    if (res.success && res.data) {
      setSec5Title(res.data.title || 'INDUSTRIES WE SERVE');
      setSec5Heading(res.data.heading || 'Security Solutions Built for Your Sector');
      setSec5Description(res.data.description || '');
      if (Array.isArray(res.data.cards) && res.data.cards.length > 0) {
        setSec5Cards(res.data.cards);
      }
    }
    setLoadingSec5(false);
  };

  // Load Section 6 data
  const loadSection6Data = async () => {
    setLoadingSec6(true);
    const res = await fetchSection6Config();
    if (res.success && res.data) {
      setSec6Title(res.data.title || 'WHY CHOOSE UNISPARK');
      setSec6Heading(res.data.heading || 'Technical Authority. Trusted Delivery.');
      setSec6Description(res.data.description || '');
      setSec6ButtonText(res.data.button?.text || 'View All Services');
      setSec6ButtonLink(res.data.button?.link || '/solutions');
      if (Array.isArray(res.data.cards) && res.data.cards.length > 0) {
        setSec6Cards(res.data.cards);
      }
    }
    setLoadingSec6(false);
  };

  // Load Partner Section 7 data
  const loadPartnerData = async () => {
    setLoadingSec7(true);
    const res = await fetchPartnerConfig();
    if (res.success && res.data) {
      setSec7Badge(res.data.badgeText || 'GLOBAL ALLIANCE');
      setSec7Heading(res.data.headingText || "Powered by the World's Leading Security Brands");
      setSec7IsVisible(res.data.isVisible !== undefined ? res.data.isVisible : true);
      setSec7BgColor(res.data.bgColor || '#ffffff');
      setSec7Speed(res.data.speed !== undefined ? res.data.speed : 25);
      if (Array.isArray(res.data.partnersList)) {
        setPartnersList(res.data.partnersList);
      }
    }
    setLoadingSec7(false);
  };

  // Load Stats Section 8 data
  const loadStatsData = async () => {
    setLoadingSec8(true);
    const res = await fetchStatsConfig();
    if (res.success && res.data) {
      if (Array.isArray(res.data.statsList)) {
        setStatsList(res.data.statsList);
      }
    }
    setLoadingSec8(false);
  };

  // Load Group Section 9 & CTA Section 10 data
  const loadGroupAndCtaData = async () => {
    const res = await fetchAboutConfig();
    if (res.success && res.data) {
      setFullAboutDoc(res.data);
      setSec9GroupBadge(res.data.groupBadge || 'CORPORATE ARCHITECTURE');
      setSec9GroupTitle(res.data.groupTitle || 'OUR GROUP STRUCTURE');
      setSec9GroupDesc(res.data.groupDesc || '');
      if (Array.isArray(res.data.groupCards)) {
        setSec9GroupCards(res.data.groupCards);
      }
      setSec10CtaBadge(res.data.ctaBadge || 'NEXT-GEN INTEGRATION');
      setSec10CtaTitle(res.data.ctaTitle || "Let's Discuss Your Security Requirements");
      setSec10CtaDesc(res.data.ctaDesc || '');
      setSec10PrimaryBtnText(res.data.ctaPrimaryBtnText || 'Request a Free Site Survey');
      setSec10PrimaryBtnLink(res.data.ctaPrimaryBtnLink || '/contact-us');
      setSec10SecondaryBtnText(res.data.ctaSecondaryBtnText || 'Download Company Profile');
      setSec10SecondaryBtnLink(res.data.ctaSecondaryBtnLink || '/company-profile.pdf');
      if (res.data.ctaBgImage) {
        setSec10CtaBgPreviewUrl(res.data.ctaBgImage);
      }
    }
  };

  useEffect(() => {
    loadHeroData();
    loadSection2Data();
    loadSection3Data();
    loadSection4Data();
    loadSection5Data();
    loadSection6Data();
    loadPartnerData();
    loadStatsData();
    loadGroupAndCtaData();
  }, []);

  // Save Section 9: Our Group Structure
  const handleSaveSec9 = async (e) => {
    if (e) e.preventDefault();
    setIsSavingSec9(true);
    const updatedPayload = {
      ...(fullAboutDoc || {}),
      groupBadge: sec9GroupBadge,
      groupTitle: sec9GroupTitle,
      groupDesc: sec9GroupDesc,
      groupCards: sec9GroupCards
    };
    const res = await updateAboutConfig(updatedPayload);
    setIsSavingSec9(false);
    if (res.success) {
      if (res.data) setFullAboutDoc(res.data);
      if (onShowToast) onShowToast('Group Structure Section saved successfully!');
    } else {
      if (onShowToast) onShowToast(res.message || 'Error saving Group Structure section.');
    }
  };

  // Save Section 10: Futuristic CTA
  const handleSaveSec10 = async (e) => {
    if (e) e.preventDefault();
    setIsSavingSec10(true);
    const updatedPayload = {
      ...(fullAboutDoc || {}),
      ctaBadge: sec10CtaBadge,
      ctaTitle: sec10CtaTitle,
      ctaDesc: sec10CtaDesc,
      ctaPrimaryBtnText: sec10PrimaryBtnText,
      ctaPrimaryBtnLink: sec10PrimaryBtnLink,
      ctaSecondaryBtnText: sec10SecondaryBtnText,
      ctaSecondaryBtnLink: sec10SecondaryBtnLink,
      ctaBgImage: sec10CtaBgBase64 || sec10CtaBgPreviewUrl
    };
    const res = await updateAboutConfig(updatedPayload);
    setIsSavingSec10(false);
    if (res.success) {
      if (res.data) {
        setFullAboutDoc(res.data);
        if (res.data.ctaBgImage) setSec10CtaBgPreviewUrl(res.data.ctaBgImage);
      }
      if (onShowToast) onShowToast('CTA Section saved successfully!');
    } else {
      if (onShowToast) onShowToast(res.message || 'Error saving CTA section.');
    }
  };

  // Section 9 Group Card Modal Handlers
  const handleOpenAddGroupCard = () => {
    setEditingGroupId(null);
    setGroupModalTag('');
    setGroupModalTitle('');
    setGroupModalSubtitle('Core Business:');
    setGroupModalTagsInput('');
    setGroupModalIcon('Building2');
    setGroupModalLink('');
    setGroupModalDisclaimer('');
    setShowGroupModal(true);
  };

  const handleOpenEditGroupCard = (card, idx) => {
    setEditingGroupId(idx);
    setGroupModalTag(card.tag || '');
    setGroupModalTitle(card.title || '');
    setGroupModalSubtitle(card.subtitle || 'Core Business:');
    setGroupModalTagsInput(Array.isArray(card.tags) ? card.tags.join(', ') : '');
    setGroupModalIcon(card.icon || 'Building2');
    setGroupModalLink(card.link || '');
    setGroupModalDisclaimer(card.disclaimer || '');
    setShowGroupModal(true);
  };

  const handleDeleteGroupCard = (idx) => {
    setSec9GroupCards(prev => prev.filter((_, i) => i !== idx));
    if (onShowToast) onShowToast('Group entity removed.');
  };

  const handleSaveModalGroupCard = () => {
    if (!groupModalTitle.trim()) {
      if (onShowToast) onShowToast('Entity Title is required.');
      return;
    }
    const parsedTags = groupModalTagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newCard = {
      tag: groupModalTag.trim(),
      title: groupModalTitle.trim(),
      subtitle: groupModalSubtitle.trim(),
      tags: parsedTags,
      icon: groupModalIcon,
      link: groupModalLink.trim(),
      disclaimer: groupModalDisclaimer.trim()
    };

    if (editingGroupId !== null) {
      setSec9GroupCards(prev => prev.map((item, i) => i === editingGroupId ? newCard : item));
    } else {
      setSec9GroupCards(prev => [...prev, newCard]);
    }

    setShowGroupModal(false);
    if (onShowToast) onShowToast(editingGroupId !== null ? 'Group entity updated.' : 'Group entity added.');
  };

  // Section 10 CTA BG Image File Select Handler
  const handleCtaBgFileSelect = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        if (onShowToast) onShowToast('Please select a valid image file.');
        return;
      }
      setSec10CtaBgPreviewUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setSec10CtaBgBase64(reader.result);
      };
      reader.readAsDataURL(file);
      if (onShowToast) onShowToast(`Selected background image: ${file.name}`);
    }
  };

  // Save Section 7: Partners
  const handleSaveSec7 = async (e) => {
    e.preventDefault();
    setIsSavingSec7(true);
    const res = await updatePartnerConfig({
      badgeText: sec7Badge,
      headingText: sec7Heading,
      isVisible: sec7IsVisible,
      bgColor: sec7BgColor,
      speed: sec7Speed,
      partnersList
    });
    setIsSavingSec7(false);
    if (res.success) {
      if (onShowToast) onShowToast('Partners Section saved successfully!');
    } else {
      if (onShowToast) onShowToast(res.message || 'Error saving Partners section.');
    }
  };

  // Save Section 8: Stats
  const handleSaveSec8 = async (e) => {
    e.preventDefault();
    setIsSavingSec8(true);
    const res = await updateStatsConfig({
      statsList
    });
    setIsSavingSec8(false);
    if (res.success) {
      if (onShowToast) onShowToast('Stats Section saved successfully!');
    } else {
      if (onShowToast) onShowToast(res.message || 'Error saving Stats section.');
    }
  };

  // Section 7 Modal Handlers
  const handleOpenAddPartner = () => {
    setEditingPartnerId(null);
    setPartnerModalName('');
    setPartnerModalLogoPreviewUrl('');
    setPartnerModalLogoBase64('');
    setPartnerModalLink('');
    setShowPartnerModal(true);
  };

  const handleOpenEditPartner = (partner, idx) => {
    setEditingPartnerId(idx);
    setPartnerModalName(partner.name || '');
    setPartnerModalLogoPreviewUrl(partner.logoUrl || '');
    setPartnerModalLogoBase64('');
    setPartnerModalLink(partner.link || '');
    setShowPartnerModal(true);
  };

  const handleDeletePartner = (idx) => {
    setPartnersList(prev => prev.filter((_, i) => i !== idx));
    if (onShowToast) onShowToast('Partner logo removed.');
  };

  const handleSaveModalPartner = () => {
    if (!partnerModalName.trim()) {
      if (onShowToast) onShowToast('Partner name is required.');
      return;
    }
    const logoToUse = partnerModalLogoBase64 || partnerModalLogoPreviewUrl || '/images/pt1.jpg';
    const newPartner = {
      name: partnerModalName.trim(),
      logoUrl: logoToUse,
      link: partnerModalLink.trim()
    };

    if (editingPartnerId !== null) {
      setPartnersList(prev => prev.map((item, i) => i === editingPartnerId ? newPartner : item));
    } else {
      setPartnersList(prev => [...prev, newPartner]);
    }

    setShowPartnerModal(false);
    if (onShowToast) onShowToast(editingPartnerId !== null ? 'Partner updated.' : 'Partner added.');
  };

  // Section 8 Modal Handlers
  const handleOpenAddStats = () => {
    setEditingStatsId(null);
    setStatsModalTitle('');
    setStatsModalSubtitle('');
    setStatsModalCaption('');
    setStatsModalIcon('MapPin');
    setShowStatsModal(true);
  };

  const handleOpenEditStats = (stat, idx) => {
    setEditingStatsId(idx);
    setStatsModalTitle(stat.title || '');
    setStatsModalSubtitle(stat.subtitle || '');
    setStatsModalCaption(stat.caption || '');
    setStatsModalIcon(stat.icon || 'MapPin');
    setShowStatsModal(true);
  };

  const handleDeleteStats = (idx) => {
    setStatsList(prev => prev.filter((_, i) => i !== idx));
    if (onShowToast) onShowToast('Stat item removed.');
  };

  const handleSaveModalStats = () => {
    if (!statsModalTitle.trim() || !statsModalSubtitle.trim()) {
      if (onShowToast) onShowToast('Title and Subtitle are required.');
      return;
    }
    const newStat = {
      title: statsModalTitle.trim(),
      subtitle: statsModalSubtitle.trim(),
      caption: statsModalCaption.trim(),
      icon: statsModalIcon
    };

    if (editingStatsId !== null) {
      setStatsList(prev => prev.map((item, i) => i === editingStatsId ? newStat : item));
    } else {
      setStatsList(prev => [...prev, newStat]);
    }

    setShowStatsModal(false);
    if (onShowToast) onShowToast(editingStatsId !== null ? 'Stat updated.' : 'Stat added.');
  };

  // Section 1: Handle adding/removing word
  const handleAddWord = () => {
    if (newWord.trim()) {
      let wordToAdd = newWord.trim();
      if (!wordToAdd.endsWith('.')) {
        wordToAdd += '.';
      }
      setWords(prev => [...prev, wordToAdd]);
      setNewWord('');
      if (onShowToast) onShowToast(`Added word: ${wordToAdd}`);
    }
  };

  const handleRemoveWord = (indexToRemove) => {
    setWords(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Section 1: Handle Video selection
  const handleVideoFileSelect = (file) => {
    if (file) {
      if (!file.type.startsWith('video/')) {
        if (onShowToast) onShowToast('Please select a valid video file (MP4, WebM).');
        return;
      }
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoBase64(reader.result);
      };
      reader.readAsDataURL(file);

      if (onShowToast) onShowToast(`Selected video: ${file.name}`);
    }
  };

  // Section 2: Handle Image selection
  const handleSec2ImageSelect = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        if (onShowToast) onShowToast('Please select a valid image file (PNG, JPG, SVG, WebP).');
        return;
      }
      setSec2ImageFile(file);
      setSec2ImagePreviewUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setSec2ImageBase64(reader.result);
      };
      reader.readAsDataURL(file);

      if (onShowToast) onShowToast(`Selected image: ${file.name}`);
    }
  };

  // Section 7: Partner Logo select
  const handlePartnerLogoSelect = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        if (onShowToast) onShowToast('Please select a valid logo image.');
        return;
      }
      setPartnerModalLogoPreviewUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPartnerModalLogoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Section 1: Save Changes
  const handleSaveHero = async (e) => {
    if (e) e.preventDefault();
    setIsSavingHero(true);

    const payload = {
      title,
      heading,
      words,
      description,
      button1: { text: button1Text, link: button1Link },
      button2: { text: button2Text, link: button2Link },
      videoUrl: videoBase64 || videoPreviewUrl
    };

    const res = await updateHeroConfig(payload);
    setIsSavingHero(false);

    if (res.success && res.data) {
      if (res.data.videoUrl) {
        setVideoPreviewUrl(res.data.videoUrl);
        setVideoBase64('');
      }
      setVideoFile(null);
      if (onShowToast) {
        onShowToast('Hero Section saved successfully to MongoDB Atlas & Cloudinary!');
      }
    } else {
      if (onShowToast) {
        onShowToast(`Error saving Hero section: ${res.message || 'Failed to save to backend'}`);
      }
    }
  };

  // Section 2: Save Changes
  const handleSaveSection2 = async (e) => {
    if (e) e.preventDefault();
    setIsSavingSec2(true);

    const payload = {
      title: sec2Title,
      heading: sec2Heading,
      description: sec2Description,
      card1: { title: card1Title, description: card1Desc },
      card2: { title: card2Title, description: card2Desc },
      ecosystemButton: { text: ecoBtnText, link: ecoBtnLink },
      imageUrl: sec2ImageBase64 || sec2ImagePreviewUrl,
      imageButton: { text: imgBtnText, link: imgBtnLink }
    };

    const res = await updateSection2Config(payload);
    setIsSavingSec2(false);

    if (res.success && res.data) {
      if (res.data.imageUrl) {
        setSec2ImagePreviewUrl(res.data.imageUrl);
        setSec2ImageBase64('');
      }
      setSec2ImageFile(null);
      if (onShowToast) {
        onShowToast('Section 2 saved successfully to MongoDB Atlas & Cloudinary!');
      }
    } else {
      if (onShowToast) {
        onShowToast(`Error saving Section 2: ${res.message || 'Failed to save to backend'}`);
      }
    }
  };

  // Section 3: Save Changes
  const handleSaveSection3 = async (e) => {
    if (e) e.preventDefault();
    setIsSavingSec3(true);

    const payload = {
      badgeText: sec3BadgeText,
      mainHeading: sec3MainHeading,
      description: sec3Description,
      viewAllButton: { text: sec3ViewAllBtnText, link: sec3ViewAllBtnLink },
      services: servicesList
    };

    const res = await updateSection3Config(payload);
    setIsSavingSec3(false);

    if (res.success && res.data) {
      if (Array.isArray(res.data.services)) {
        setServicesList(res.data.services);
      }
      if (res.data.viewAllButton) {
        setSec3ViewAllBtnText(res.data.viewAllButton.text || 'View All Services');
        setSec3ViewAllBtnLink(res.data.viewAllButton.link || '/solutions');
      }
      if (onShowToast) {
        onShowToast('Section 3 saved successfully to MongoDB Atlas!');
      }
    } else {
      if (onShowToast) {
        onShowToast(`Error saving Section 3: ${res.message || 'Failed to save to backend'}`);
      }
    }
  };

  // Section 4: Save Changes
  const handleSaveSection4 = async (e) => {
    if (e) e.preventDefault();
    setIsSavingSec4(true);

    const payload = {
      title: sec4Title,
      heading: sec4Heading,
      cards: sec4Cards
    };

    const res = await updateSection4Config(payload);
    setIsSavingSec4(false);

    if (res.success && res.data) {
      if (Array.isArray(res.data.cards)) {
        setSec4Cards(res.data.cards);
      }
      if (onShowToast) {
        onShowToast('Section 4 saved successfully to MongoDB Atlas!');
      }
    } else {
      if (onShowToast) {
        onShowToast(`Error saving Section 4: ${res.message || 'Failed to save to backend'}`);
      }
    }
  };

  // Section 5: Save Changes
  const handleSaveSection5 = async (e) => {
    if (e) e.preventDefault();
    setIsSavingSec5(true);

    const payload = {
      title: sec5Title,
      heading: sec5Heading,
      description: sec5Description,
      cards: sec5Cards
    };

    const res = await updateSection5Config(payload);
    setIsSavingSec5(false);

    if (res.success && res.data) {
      if (Array.isArray(res.data.cards)) {
        setSec5Cards(res.data.cards);
      }
      if (onShowToast) {
        onShowToast('Section 5 saved successfully to MongoDB Atlas & Cloudinary!');
      }
    } else {
      if (onShowToast) {
        onShowToast(`Error saving Section 5: ${res.message || 'Failed to save to backend'}`);
      }
    }
  };

  // Section 6: Save Changes
  const handleSaveSection6 = async (e) => {
    if (e) e.preventDefault();
    setIsSavingSec6(true);

    const payload = {
      title: sec6Title,
      heading: sec6Heading,
      description: sec6Description,
      button: {
        text: sec6ButtonText,
        link: sec6ButtonLink
      },
      cards: sec6Cards
    };

    const res = await updateSection6Config(payload);
    setIsSavingSec6(false);

    if (res.success && res.data) {
      if (Array.isArray(res.data.cards)) {
        setSec6Cards(res.data.cards);
      }
      if (onShowToast) {
        onShowToast('Section 6 saved successfully to MongoDB Atlas!');
      }
    } else {
      if (onShowToast) {
        onShowToast(`Error saving Section 6: ${res.message || 'Failed to save to backend'}`);
      }
    }
  };

  // Open Add Service Modal
  const handleOpenAddServiceModal = () => {
    setEditingServiceId(null);
    setServiceModalTitle('');
    setServiceModalDesc('');
    setServiceModalIcon('fa-video');
    setServiceModalIconUrl('');
    setServiceModalIconBase64('');
    setServiceModalFeatured(false);
    setShowServiceModal(true);
  };

  // Open Edit Service Modal
  const handleOpenEditServiceModal = (service) => {
    setEditingServiceId(service.id);
    setServiceModalTitle(service.title);
    setServiceModalDesc(service.desc || '');
    setServiceModalIcon(service.icon || 'fa-video');
    setServiceModalIconUrl(service.iconUrl || '');
    setServiceModalIconBase64('');
    setServiceModalFeatured(!!service.featured);
    setShowServiceModal(true);
  };

  // Handle Service Icon File Upload
  const handleServiceIconFileSelect = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        if (onShowToast) onShowToast('Please upload a valid image file (PNG, SVG, JPG).');
        return;
      }
      setServiceModalIconUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setServiceModalIconBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Service from Modal
  const handleSaveModalService = () => {
    if (!serviceModalTitle.trim()) {
      if (onShowToast) onShowToast('Service Title is required.');
      return;
    }

    const newServiceObj = {
      id: editingServiceId || `service-${Date.now()}`,
      title: serviceModalTitle.trim(),
      desc: serviceModalDesc.trim(),
      icon: serviceModalIcon.trim() || 'fa-shield-halved',
      iconUrl: serviceModalIconBase64 || serviceModalIconUrl,
      featured: serviceModalFeatured
    };

    if (editingServiceId) {
      setServicesList(prev => prev.map(s => s.id === editingServiceId ? newServiceObj : s));
      if (onShowToast) onShowToast('Service updated locally! Click Save to publish.');
    } else {
      setServicesList(prev => [...prev, newServiceObj]);
      if (onShowToast) onShowToast('New Service added! Click Save to publish.');
    }

    setShowServiceModal(false);
  };

  // Delete Service
  const handleDeleteService = (idToDelete) => {
    setServicesList(prev => prev.filter(s => s.id !== idToDelete));
    if (onShowToast) onShowToast('Service removed. Click Save Changes to update database.');
  };

  // Toggle Featured status directly
  const handleToggleFeatured = (idToToggle) => {
    setServicesList(prev => prev.map(s => s.id === idToToggle ? { ...s, featured: !s.featured } : s));
  };

  // Section 4: Modals
  const handleOpenAddSec4Modal = () => {
    setEditingSec4Id(null);
    setSec4ModalTitle('');
    setSec4ModalDesc('');
    setSec4ModalIcon('fa-screwdriver-wrench');
    setSec4ModalBtnText('');
    setSec4ModalBtnLink('');
    setShowSec4Modal(true);
  };

  const handleOpenEditSec4Modal = (card) => {
    setEditingSec4Id(card._id || card.id);
    setSec4ModalTitle(card.title);
    setSec4ModalDesc(card.description || '');
    setSec4ModalIcon(card.icon || 'fa-screwdriver-wrench');
    setSec4ModalBtnText(card.buttonText || '');
    setSec4ModalBtnLink(card.buttonLink || '');
    setShowSec4Modal(true);
  };

  const handleSaveModalSec4 = () => {
    if (!sec4ModalTitle.trim()) {
      if (onShowToast) onShowToast('Card Title is required.');
      return;
    }

    const newCardObj = {
      id: editingSec4Id || `sec4-${Date.now()}`,
      _id: editingSec4Id || undefined,
      title: sec4ModalTitle.trim(),
      description: sec4ModalDesc.trim(),
      icon: sec4ModalIcon.trim() || 'fa-screwdriver-wrench',
      buttonText: sec4ModalBtnText.trim(),
      buttonLink: sec4ModalBtnLink.trim()
    };

    if (editingSec4Id) {
      setSec4Cards(prev => prev.map(c => (c._id === editingSec4Id || c.id === editingSec4Id) ? newCardObj : c));
      if (onShowToast) onShowToast('Card updated locally! Click Save to publish.');
    } else {
      setSec4Cards(prev => [...prev, newCardObj]);
      if (onShowToast) onShowToast('New Card added! Click Save to publish.');
    }
    setShowSec4Modal(false);
  };

  const handleDeleteSec4Card = (idToDelete) => {
    setSec4Cards(prev => prev.filter(c => (c._id !== idToDelete && c.id !== idToDelete)));
    if (onShowToast) onShowToast('Card removed. Click Save Changes to update database.');
  };

  // Section 5: Modals and Handlers
  const handleOpenAddSec5Modal = () => {
    setEditingSec5Id(null);
    setSec5ModalTitle('');
    setSec5ModalDesc('');
    setSec5ModalImageFile(null);
    setSec5ModalImagePreviewUrl('');
    setSec5ModalImageBase64('');
    setSec5ModalBtnLink('');
    setShowSec5Modal(true);
  };

  const handleOpenEditSec5Modal = (card) => {
    setEditingSec5Id(card._id || card.id);
    setSec5ModalTitle(card.title);
    setSec5ModalDesc(card.subtitle || '');
    setSec5ModalImageFile(null);
    setSec5ModalImagePreviewUrl(card.image || '');
    setSec5ModalImageBase64('');
    setSec5ModalBtnLink(card.link || '');
    setShowSec5Modal(true);
  };

  const handleSec5ImageSelect = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        if (onShowToast) onShowToast('Please upload a valid image file (PNG, SVG, JPG).');
        return;
      }
      setSec5ModalImageFile(file);
      setSec5ModalImagePreviewUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setSec5ModalImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveModalSec5 = () => {
    if (!sec5ModalTitle.trim()) {
      if (onShowToast) onShowToast('Card Title is required.');
      return;
    }
    if (!sec5ModalImageBase64 && !sec5ModalImagePreviewUrl) {
      if (onShowToast) onShowToast('Card Image is required.');
      return;
    }

    const newCardObj = {
      id: editingSec5Id || `sec5-${Date.now()}`,
      _id: editingSec5Id || undefined,
      title: sec5ModalTitle.trim(),
      subtitle: sec5ModalDesc.trim(),
      image: sec5ModalImageBase64 || sec5ModalImagePreviewUrl,
      link: sec5ModalBtnLink.trim()
    };

    if (editingSec5Id) {
      setSec5Cards(prev => prev.map(c => (c._id === editingSec5Id || c.id === editingSec5Id) ? newCardObj : c));
      if (onShowToast) onShowToast('Card updated locally! Click Save to publish.');
    } else {
      setSec5Cards(prev => [...prev, newCardObj]);
      if (onShowToast) onShowToast('New Card added! Click Save to publish.');
    }
    setShowSec5Modal(false);
  };

  const handleDeleteSec5Card = (idToDelete) => {
    setSec5Cards(prev => prev.filter(c => (c._id !== idToDelete && c.id !== idToDelete)));
    if (onShowToast) onShowToast('Card removed. Click Save Changes to update database.');
  };

  // Section 6: Modals and Handlers
  const handleOpenAddSec6Modal = () => {
    setEditingSec6Id(null);
    setSec6ModalTitle('');
    setSec6ModalDesc('');
    setSec6ModalIcon('');
    setSec6ModalImageFile(null);
    setSec6ModalImagePreviewUrl('');
    setSec6ModalImageBase64('');
    setShowSec6Modal(true);
  };

  const handleOpenEditSec6Modal = (card) => {
    setEditingSec6Id(card._id || card.id);
    setSec6ModalTitle(card.title);
    setSec6ModalDesc(card.description || '');
    if (card.icon && (card.icon.startsWith('data:image/') || card.icon.startsWith('http'))) {
      setSec6ModalImagePreviewUrl(card.icon);
      setSec6ModalIcon('');
    } else {
      setSec6ModalIcon(card.icon || '');
      setSec6ModalImagePreviewUrl('');
    }
    setSec6ModalImageFile(null);
    setSec6ModalImageBase64('');
    setShowSec6Modal(true);
  };

  const handleSec6ImageSelect = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        if (onShowToast) onShowToast('Please upload a valid image file (PNG, SVG, JPG).');
        return;
      }
      setSec6ModalImageFile(file);
      setSec6ModalImagePreviewUrl(URL.createObjectURL(file));
      setSec6ModalIcon('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSec6ModalImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveModalSec6 = () => {
    if (!sec6ModalTitle.trim()) {
      if (onShowToast) onShowToast('Card Title is required.');
      return;
    }

    const newCardObj = {
      id: editingSec6Id || `sec6-${Date.now()}`,
      _id: editingSec6Id || undefined,
      title: sec6ModalTitle.trim(),
      description: sec6ModalDesc.trim(),
      icon: sec6ModalImageBase64 || sec6ModalImagePreviewUrl || sec6ModalIcon.trim() || 'fa-award'
    };

    if (editingSec6Id) {
      setSec6Cards(prev => prev.map(c => (c._id === editingSec6Id || c.id === editingSec6Id) ? newCardObj : c));
      if (onShowToast) onShowToast('Card updated locally! Click Save to publish.');
    } else {
      setSec6Cards(prev => [...prev, newCardObj]);
      if (onShowToast) onShowToast('New Card added! Click Save to publish.');
    }
    setShowSec6Modal(false);
  };

  const handleDeleteSec6Card = (idToDelete) => {
    setSec6Cards(prev => prev.filter(c => (c._id !== idToDelete && c.id !== idToDelete)));
    if (onShowToast) onShowToast('Card removed. Click Save Changes to update database.');
  };

  if (loadingHero && loadingSec2 && loadingSec3) {
    return (
      <div className="content-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Home configurations from database...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%' }}>

      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION CARD                                              */}
      {/* ========================================================================= */}
      <div className="content-card" style={{ width: '100%' }}>

        {/* Header Bar */}
        <div
          className="content-card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Home &gt; Hero Section
            </h2>
          </div>

          <button
            type="button"
            onClick={handleSaveHero}
            className="btn-primary"
            style={{ margin: 0, padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            disabled={isSavingHero}
          >
            <Save size={16} />
            <span>{isSavingHero ? 'Saving...' : 'Save Changes'} 💾</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Hero Section
            </h3>

            {/* Title * */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" htmlFor="hero-title" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Title <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="hero-title"
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Welcome to Unispark"
                required
              />
            </div>

            {/* Heading * */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" htmlFor="hero-heading" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Heading <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                id="hero-heading"
                className="form-control"
                rows={2}
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="UAE's Trusted Security Systems Partner"
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Animated / Rotating Words Section */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Type size={16} color="var(--primary)" />
                Animated / Rotating Words
              </label>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                These words rotate dynamically in the hero tagline header (e.g. UAE's Trusted Security Systems Partner - <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Design.</span>)
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                {words.map((word, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    <span>{word}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWord(index)}
                      style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '0 0.2rem', border: 'none', background: 'none' }}
                      title="Remove word"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '480px', marginTop: '0.25rem' }}>
                <input
                  type="text"
                  className="form-control"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddWord();
                    }
                  }}
                  placeholder="Add new word (e.g. Maintenance.)"
                />
                <button
                  type="button"
                  onClick={handleAddWord}
                  className="file-upload-btn"
                  style={{ padding: '0.55rem 1.25rem', whiteSpace: 'nowrap', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}
                >
                  <Plus size={16} />
                  <span>Add Word</span>
                </button>
              </div>
            </div>

            {/* Description * */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" htmlFor="hero-description" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Description <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                id="hero-description"
                className="form-control"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Lorem ipsum dolor sit amet..."
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Buttons Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Button 1 Text</label>
                  <input type="text" className="form-control" value={button1Text} onChange={(e) => setButton1Text(e.target.value)} placeholder="Button 1 Text" />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Button 1 Link</label>
                  <input type="text" className="form-control" value={button1Link} onChange={(e) => setButton1Link(e.target.value)} placeholder="/solutions" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Button 2 Text</label>
                  <input type="text" className="form-control" value={button2Text} onChange={(e) => setButton2Text(e.target.value)} placeholder="Button 2 Text" />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Button 2 Link</label>
                  <input type="text" className="form-control" value={button2Link} onChange={(e) => setButton2Link(e.target.value)} placeholder="/contact-us" />
                </div>
              </div>
            </div>

            {/* Background Video Section */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Background Video</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingVideo(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDraggingVideo(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingVideo(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) handleVideoFileSelect(e.dataTransfer.files[0]);
                }}
                onClick={() => document.getElementById('hero-video-drop-input').click()}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  border: `2px dashed ${isDraggingVideo ? 'var(--primary)' : 'var(--border-light)'}`,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isDraggingVideo ? 'var(--primary-light)' : 'var(--bg-input)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <input id="hero-video-drop-input" type="file" accept="video/*" onChange={(e) => handleVideoFileSelect(e.target.files[0])} style={{ display: 'none' }} />
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎥</div>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Drag &amp; Drop Video Here</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500, marginBottom: '0.75rem' }}>or Click to Upload</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                  MP4 • Max 100MB
                </span>
                {videoFile && (
                  <div style={{ marginTop: '1rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                    Selected: {videoFile.name}
                  </div>
                )}
              </div>

              {videoPreviewUrl && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current Active Video Preview:</p>
                  <div className="video-preview-box" style={{ maxWidth: '640px', height: '260px' }}>
                    <video key={videoPreviewUrl} src={videoPreviewUrl} controls autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} disabled={isSavingHero}>
                <Save size={18} />
                <span>{isSavingHero ? 'Uploading Video & Saving...' : 'Save Changes'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MARQUEE TICKER SECTION (BETWEEN SECTION 1 & SECTION 2)                    */}
      {/* ========================================================================= */}
      <MarqueeEditor onShowToast={onShowToast} />

      {/* ========================================================================= */}
      {/* SECTION 2: SECTION 2 SETTINGS CARD                                         */}
      {/* ========================================================================= */}
      <div className="content-card" style={{ width: '100%' }}>

        {/* Section 2 Header Bar */}
        <div
          className="content-card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Home &gt; Website &gt; Home &gt; Section 2
            </h2>
          </div>

          <button
            type="button"
            onClick={handleSaveSection2}
            className="btn-primary"
            style={{ margin: 0, padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            disabled={isSavingSec2}
          >
            <Save size={16} />
            <span>{isSavingSec2 ? 'Saving...' : 'Save Changes'} 💾</span>
          </button>
        </div>

        {/* Section 2 Card Body */}
        <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <form onSubmit={handleSaveSection2} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Section 2 Settings
            </h3>

            {/* Title */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" htmlFor="sec2-title" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Title
              </label>
              <input
                id="sec2-title"
                type="text"
                className="form-control"
                value={sec2Title}
                onChange={(e) => setSec2Title(e.target.value)}
                placeholder="Pioneering the Future of Secured Intelligence"
              />
            </div>

            {/* Heading / Badge Tag */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" htmlFor="sec2-heading" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Heading / Badge Tag
              </label>
              <input
                id="sec2-heading"
                type="text"
                className="form-control"
                value={sec2Heading}
                onChange={(e) => setSec2Heading(e.target.value)}
                placeholder="Next-Gen Architecture"
              />
            </div>

            {/* Description */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" htmlFor="sec2-description" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Description
              </label>
              <textarea
                id="sec2-description"
                className="form-control"
                rows={4}
                value={sec2Description}
                onChange={(e) => setSec2Description(e.target.value)}
                placeholder="UniSpark Innovation architectures orchestrate friction-free continuous analysis..."
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Feature Cards Grid (2 Boxes) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

              {/* Card 1 */}
              <div style={{ backgroundColor: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    Button Title / Card 1 Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={card1Title}
                    onChange={(e) => setCard1Title(e.target.value)}
                    placeholder="Cognitive Shielding"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={card1Desc}
                    onChange={(e) => setCard1Desc(e.target.value)}
                    placeholder="Self-learning neural vectors adapt..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ backgroundColor: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    Button Title / Card 2 Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={card2Title}
                    onChange={(e) => setCard2Title(e.target.value)}
                    placeholder="Microsecond Latency"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={card2Desc}
                    onChange={(e) => setCard2Desc(e.target.value)}
                    placeholder="Sub-atomic detection layers..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

            </div>

            {/* Our Ecosystem Button */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="eco-btn-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  Our Ecosystem Button Text
                </label>
                <input
                  id="eco-btn-text"
                  type="text"
                  className="form-control"
                  value={ecoBtnText}
                  onChange={(e) => setEcoBtnText(e.target.value)}
                  placeholder="Our Ecosystem"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="eco-btn-link" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  Our Ecosystem Button Link
                </label>
                <input
                  id="eco-btn-link"
                  type="text"
                  className="form-control"
                  value={ecoBtnLink}
                  onChange={(e) => setEcoBtnLink(e.target.value)}
                  placeholder="/about-us"
                />
              </div>
            </div>

            {/* Upload Image Section */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Upload Image
              </label>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDraggingImage(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingImage(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleSec2ImageSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => document.getElementById('sec2-image-drop-input').click()}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  border: `2px dashed ${isDraggingImage ? 'var(--primary)' : 'var(--border-light)'}`,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isDraggingImage ? 'var(--primary-light)' : 'var(--bg-input)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  id="sec2-image-drop-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSec2ImageSelect(e.target.files[0])}
                  style={{ display: 'none' }}
                />

                <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>
                  📤
                </div>

                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  Upload Image
                </p>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Drag &amp; Drop or Click to Upload
                </p>

                {sec2ImageFile && (
                  <div style={{ marginTop: '1rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                    Selected: {sec2ImageFile.name}
                  </div>
                )}
              </div>

              {/* Image Preview */}
              {sec2ImagePreviewUrl && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Active Section 2 Image Preview:
                  </p>
                  <div style={{ maxWidth: '440px', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={sec2ImagePreviewUrl} alt="Section 2 Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Image Button */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="img-btn-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  Image Button Text / Floating Badge Title
                </label>
                <input
                  id="img-btn-text"
                  type="text"
                  className="form-control"
                  value={imgBtnText}
                  onChange={(e) => setImgBtnText(e.target.value)}
                  placeholder="99.99% Threat Isolation"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="img-btn-link" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  Image Button Link
                </label>
                <input
                  id="img-btn-link"
                  type="text"
                  className="form-control"
                  value={imgBtnLink}
                  onChange={(e) => setImgBtnLink(e.target.value)}
                  placeholder="/solutions"
                />
              </div>
            </div>

            {/* Section 2 Save Changes Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}
                disabled={isSavingSec2}
              >
                <Save size={18} />
                <span>{isSavingSec2 ? 'Uploading Image & Saving...' : 'Save Changes'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>


      {/* ========================================================================= */}
      {/* SECTION 3: SERVICES SECTION CARD                                          */}
      {/* ========================================================================= */}
      <div className="content-card" style={{ width: '100%' }}>

        {/* Section 3 Header Bar */}
        <div
          className="content-card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Home / Website / Section 3
            </h2>
          </div>

          <button
            type="button"
            onClick={handleSaveSection3}
            className="btn-primary"
            style={{ margin: 0, padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            disabled={isSavingSec3}
          >
            <Save size={16} />
            <span>{isSavingSec3 ? 'Saving...' : 'Save'} 💾</span>
          </button>
        </div>

        {/* Section 3 Card Body */}
        <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

          {/* SECTION SETTINGS BOX */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.05em' }}>
              SECTION SETTINGS
            </h3>

            {/* Badge Text * */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" htmlFor="sec3-badge" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Badge Text <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="sec3-badge"
                type="text"
                className="form-control"
                value={sec3BadgeText}
                onChange={(e) => setSec3BadgeText(e.target.value)}
                placeholder="WHAT WE DO"
                required
              />
            </div>

            {/* Main Heading * */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" htmlFor="sec3-heading" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Main Heading <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="sec3-heading"
                type="text"
                className="form-control"
                value={sec3MainHeading}
                onChange={(e) => setSec3MainHeading(e.target.value)}
                placeholder="End-to-End Physical Security Solutions"
                required
              />
            </div>

            {/* Description * */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" htmlFor="sec3-desc" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Description <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                id="sec3-desc"
                className="form-control"
                rows={3}
                value={sec3Description}
                onChange={(e) => setSec3Description(e.target.value)}
                placeholder="From initial site survey and system design through installation..."
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* View All Services Button Text & Link Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', backgroundColor: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" htmlFor="sec3-btn-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  View All Services Button Text
                </label>
                <input
                  id="sec3-btn-text"
                  type="text"
                  className="form-control"
                  value={sec3ViewAllBtnText}
                  onChange={(e) => setSec3ViewAllBtnText(e.target.value)}
                  placeholder="View All Services"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" htmlFor="sec3-btn-link" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  View All Services Button Link
                </label>
                <input
                  id="sec3-btn-link"
                  type="text"
                  className="form-control"
                  value={sec3ViewAllBtnLink}
                  onChange={(e) => setSec3ViewAllBtnLink(e.target.value)}
                  placeholder="/solutions"
                />
              </div>
            </div>

          </div>

          {/* SERVICES LIST BOX */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Services Header & Add Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.05em' }}>
                SERVICES ({servicesList.length})
              </h3>

              <button
                type="button"
                onClick={handleOpenAddServiceModal}
                className="file-upload-btn"
                style={{ padding: '0.5rem 1.25rem', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}
              >
                <Plus size={16} />
                <span>+ Add Service</span>
              </button>
            </div>

            {/* Services Items Grid / List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {servicesList.map((service, index) => (
                <div
                  key={service.id || index}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>

                    {/* Icon Preview */}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        shrink: 0,
                        overflow: 'hidden',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}
                    >
                      {service.iconUrl ? (
                        <img src={service.iconUrl} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <i className={`fa-solid ${service.icon || 'fa-shield-halved'}`}></i>
                      )}
                    </div>

                    {/* Title & Desc */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {service.title}
                        </h4>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {service.desc || 'No description provided'}
                      </p>
                    </div>

                  </div>

                  {/* Actions & Status Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>

                    {/* Featured Status Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(service.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: service.featured ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-input)',
                        color: service.featured ? 'var(--success)' : 'var(--text-muted)',
                        border: `1px solid ${service.featured ? 'rgba(34, 197, 94, 0.3)' : 'var(--border-color)'}`,
                        cursor: 'pointer'
                      }}
                      title="Click to toggle Featured"
                    >
                      <span>Featured</span>
                      {service.featured && <Check size={13} />}
                    </button>

                    {/* Edit & Delete Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditServiceModal(service)}
                        className="file-upload-btn"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteService(service.id)}
                        style={{
                          padding: '0.35rem 0.6rem',
                          fontSize: '0.75rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: 'var(--danger)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                        title="Delete Service"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Section 3 Save Changes Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={handleSaveSection3}
              className="btn-primary"
              style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}
              disabled={isSavingSec3}
            >
              <Save size={18} />
              <span>{isSavingSec3 ? 'Saving Section 3...' : 'Save Changes'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT SERVICE MODAL DIALOG                                           */}
      {/* ========================================================================= */}
      {showServiceModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '520px',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                {editingServiceId ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                type="button"
                onClick={() => setShowServiceModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Service Title */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Service Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={serviceModalTitle}
                  onChange={(e) => setServiceModalTitle(e.target.value)}
                  placeholder="e.g. CCTV & IP Camera Systems"
                  required
                />
              </div>

              {/* Service Description */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={serviceModalDesc}
                  onChange={(e) => setServiceModalDesc(e.target.value)}
                  placeholder="e.g. HD surveillance, remote monitoring..."
                />
              </div>

              {/* Icon FontAwesome Class */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>FontAwesome Icon Class</label>
                <input
                  type="text"
                  className="form-control"
                  value={serviceModalIcon}
                  onChange={(e) => setServiceModalIcon(e.target.value)}
                  placeholder="e.g. fa-video, fa-id-card-clip, fa-bell"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Examples: fa-video, fa-id-card-clip, fa-bell, fa-fire-extinguisher, fa-fingerprint, fa-display
                </span>
              </div>

              {/* Or Custom Icon Image Upload */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Or Upload Custom Icon Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleServiceIconFileSelect(e.target.files[0])}
                  className="form-control"
                />
                {serviceModalIconUrl && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preview:</span>
                    <img src={serviceModalIconUrl} alt="Icon preview" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Featured Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <input
                  id="modal-featured-check"
                  type="checkbox"
                  checked={serviceModalFeatured}
                  onChange={(e) => setServiceModalFeatured(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="modal-featured-check" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                  Mark as Featured Service ✓
                </label>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
              <button
                type="button"
                onClick={() => setShowServiceModal(false)}
                className="file-upload-btn"
                style={{ padding: '0.5rem 1.25rem' }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveModalService}
                className="btn-primary"
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
              >
                {editingServiceId ? 'Update Service' : 'Add Service'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: DIVISIONS SECTION CARD                                         */}
      {/* ========================================================================= */}
      <div className="content-card" style={{ width: '100%' }}>

        {/* Section 4 Header Bar */}
        <div
          className="content-card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Home &gt; Website &gt; Home &gt; Section 4 (Divisions)
            </h2>
          </div>

          <button
            type="button"
            onClick={handleSaveSection4}
            className="btn-primary"
            style={{ margin: 0, padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            disabled={isSavingSec4}
          >
            <Save size={16} />
            <span>{isSavingSec4 ? 'Saving...' : 'Save Changes'} 💾</span>
          </button>
        </div>

        {/* Section 4 Card Body */}
        <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <form onSubmit={handleSaveSection4} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Divisions Section Settings
            </h3>

            {/* Title */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Title
              </label>
              <input
                type="text"
                className="form-control"
                value={sec4Title}
                onChange={(e) => setSec4Title(e.target.value)}
                placeholder="Our Two Divisions"
              />
            </div>

            {/* Heading */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Heading
              </label>
              <input
                type="text"
                className="form-control"
                value={sec4Heading}
                onChange={(e) => setSec4Heading(e.target.value)}
                placeholder="One Partner. Two Specialist Divisions."
              />
            </div>

            {/* Cards Grid Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Cards
              </h3>

              <button
                type="button"
                onClick={handleOpenAddSec4Modal}
                className="btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', margin: 0 }}
              >
                <Plus size={14} />
                <span>Add Card</span>
              </button>
            </div>

            {/* Cards List Grid */}
            {sec4Cards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No cards found. Click "Add Card" to create one.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {sec4Cards.map((card) => (
                  <div key={card.id || card._id} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>

                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className={`fa-solid ${card.icon || 'fa-screwdriver-wrench'} text-lg`}></i>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                        {card.title}
                      </h4>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                        {card.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>Button:</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{card.buttonText || '-'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Link: {card.buttonLink || '-'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', padding: '0.75rem 1.25rem', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditSec4Modal(card)}
                        className="file-upload-btn"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSec4Card(card.id || card._id)}
                        style={{
                          padding: '0.35rem 0.6rem',
                          fontSize: '0.75rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: 'var(--danger)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer'
                        }}
                        title="Delete Card"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} disabled={isSavingSec4}>
                <Save size={18} />
                <span>{isSavingSec4 ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: CARD MODAL                                                     */}
      {/* ========================================================================= */}
      {showSec4Modal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {editingSec4Id ? 'Edit Card' : 'Add New Card'}
              </h3>
              <button onClick={() => setShowSec4Modal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Title *</label>
                <input type="text" className="form-control" value={sec4ModalTitle} onChange={(e) => setSec4ModalTitle(e.target.value)} placeholder="e.g. Installation & Maintenance" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
                <textarea className="form-control" rows={3} value={sec4ModalDesc} onChange={(e) => setSec4ModalDesc(e.target.value)} placeholder="e.g. Professional design, supply..." />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>FontAwesome Icon Class</label>
                <input type="text" className="form-control" value={sec4ModalIcon} onChange={(e) => setSec4ModalIcon(e.target.value)} placeholder="e.g. fa-screwdriver-wrench, fa-truck-ramp-box" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Button Text</label>
                  <input type="text" className="form-control" value={sec4ModalBtnText} onChange={(e) => setSec4ModalBtnText(e.target.value)} placeholder="Explore Installation Services" />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Button Link</label>
                  <input type="text" className="form-control" value={sec4ModalBtnLink} onChange={(e) => setSec4ModalBtnLink(e.target.value)} placeholder="/solutions" />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
              <button type="button" onClick={() => setShowSec4Modal(false)} className="file-upload-btn" style={{ padding: '0.5rem 1.25rem' }}>Cancel</button>
              <button type="button" onClick={handleSaveModalSec4} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
                {editingSec4Id ? 'Update Card' : 'Add Card'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: INDUSTRIES SECTION CARD                                        */}
      {/* ========================================================================= */}
      <div className="content-card" style={{ width: '100%' }}>

        {/* Section 5 Header Bar */}
        <div
          className="content-card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Home &gt; Website &gt; Home &gt; Section 5 (Industries)
            </h2>
          </div>

          <button
            type="button"
            onClick={handleSaveSection5}
            className="btn-primary"
            style={{ margin: 0, padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            disabled={isSavingSec5}
          >
            <Save size={16} />
            <span>{isSavingSec5 ? 'Saving...' : 'Save Changes'} 💾</span>
          </button>
        </div>

        {/* Section 5 Card Body */}
        <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <form onSubmit={handleSaveSection5} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Industries Section Settings
            </h3>

            {/* Title */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Title
              </label>
              <input
                type="text"
                className="form-control"
                value={sec5Title}
                onChange={(e) => setSec5Title(e.target.value)}
                placeholder="INDUSTRIES WE SERVE"
              />
            </div>

            {/* Heading */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Heading
              </label>
              <input
                type="text"
                className="form-control"
                value={sec5Heading}
                onChange={(e) => setSec5Heading(e.target.value)}
                placeholder="Security Solutions Built for Your Sector"
              />
            </div>

            {/* Description */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Description
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={sec5Description}
                onChange={(e) => setSec5Description(e.target.value)}
                placeholder="Deploying custom, advanced cyber-security..."
              />
            </div>

            {/* Cards Grid Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Service Cards
              </h3>

              <button
                type="button"
                onClick={handleOpenAddSec5Modal}
                className="btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', margin: 0 }}
              >
                <Plus size={14} />
                <span>Add Card</span>
              </button>
            </div>

            {/* Cards List Grid */}
            {sec5Cards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No cards found. Click "Add Card" to create one.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {sec5Cards.map((card) => (
                  <div key={card.id || card._id} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>

                    <div style={{ width: '100%', height: '140px', backgroundColor: 'var(--bg-input)' }}>
                      <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                        {card.title}
                      </h4>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                        {card.subtitle}
                      </p>

                      <div style={{ marginTop: '0.5rem', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>Link: </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{card.link || '-'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', padding: '0.75rem 1.25rem', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditSec5Modal(card)}
                        className="file-upload-btn"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSec5Card(card.id || card._id)}
                        style={{
                          padding: '0.35rem 0.6rem',
                          fontSize: '0.75rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: 'var(--danger)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer'
                        }}
                        title="Delete Card"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} disabled={isSavingSec5}>
                <Save size={18} />
                <span>{isSavingSec5 ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: CARD MODAL                                                     */}
      {/* ========================================================================= */}
      {showSec5Modal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {editingSec5Id ? 'Edit Service Card' : 'Add New Service Card'}
              </h3>
              <button onClick={() => setShowSec5Modal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Card Image Upload *</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSec5ImageSelect(e.target.files[0])}
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  {sec5ModalImagePreviewUrl && (
                    <img src={sec5ModalImagePreviewUrl} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} />
                  )}
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Title *</label>
                <input type="text" className="form-control" value={sec5ModalTitle} onChange={(e) => setSec5ModalTitle(e.target.value)} placeholder="e.g. Commercial" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
                <textarea className="form-control" rows={3} value={sec5ModalDesc} onChange={(e) => setSec5ModalDesc(e.target.value)} placeholder="e.g. Corporate offices, retail chains..." />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Redirect Link</label>
                <input type="text" className="form-control" value={sec5ModalBtnLink} onChange={(e) => setSec5ModalBtnLink(e.target.value)} placeholder="/industries/commercial" />
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
              <button type="button" onClick={() => setShowSec5Modal(false)} className="file-upload-btn" style={{ padding: '0.5rem 1.25rem' }}>Cancel</button>
              <button type="button" onClick={handleSaveModalSec5} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
                {editingSec5Id ? 'Update Card' : 'Add Card'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: WHY US SECTION CARD                                            */}
      {/* ========================================================================= */}
      <div className="content-card" style={{ width: '100%' }}>

        {/* Section 6 Header Bar */}
        <div
          className="content-card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Home &gt; Website &gt; Home &gt; Section 6 (Why Choose Us)
            </h2>
          </div>

          <button
            type="button"
            onClick={handleSaveSection6}
            className="btn-primary"
            style={{ margin: 0, padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            disabled={isSavingSec6}
          >
            <Save size={16} />
            <span>{isSavingSec6 ? 'Saving...' : 'Save Changes'} 💾</span>
          </button>
        </div>

        {/* Section 6 Card Body */}
        <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <form onSubmit={handleSaveSection6} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Why Us Section Settings
            </h3>

            {/* Title */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Title
              </label>
              <input
                type="text"
                className="form-control"
                value={sec6Title}
                onChange={(e) => setSec6Title(e.target.value)}
                placeholder="WHY CHOOSE UNISPARK"
              />
            </div>

            {/* Heading */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Heading
              </label>
              <input
                type="text"
                className="form-control"
                value={sec6Heading}
                onChange={(e) => setSec6Heading(e.target.value)}
                placeholder="Technical Authority. Trusted Delivery."
              />
            </div>

            {/* Description */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Description
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={sec6Description}
                onChange={(e) => setSec6Description(e.target.value)}
                placeholder="We combine regulatory expertise..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  Button Text
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={sec6ButtonText}
                  onChange={(e) => setSec6ButtonText(e.target.value)}
                  placeholder="View All Services"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  Button Link
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={sec6ButtonLink}
                  onChange={(e) => setSec6ButtonLink(e.target.value)}
                  placeholder="/solutions"
                />
              </div>
            </div>

            {/* Cards Grid Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Pillar Cards
              </h3>

              <button
                type="button"
                onClick={handleOpenAddSec6Modal}
                className="btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', margin: 0 }}
              >
                <Plus size={14} />
                <span>Add Card</span>
              </button>
            </div>

            {/* Cards List Grid */}
            {sec6Cards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No cards found. Click "Add Card" to create one.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {sec6Cards.map((card) => (
                  <div key={card.id || card._id} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>

                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                      {card.icon && (card.icon.startsWith('http') || card.icon.startsWith('data:image/')) ? (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden' }}>
                          <img src={card.icon} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className={`fa-solid ${card.icon || 'fa-award'} text-xl`}></i>
                        </div>
                      )}

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                        {card.title}
                      </h4>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                        {card.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', padding: '0.75rem 1.25rem', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditSec6Modal(card)}
                        className="file-upload-btn"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSec6Card(card.id || card._id)}
                        style={{
                          padding: '0.35rem 0.6rem',
                          fontSize: '0.75rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: 'var(--danger)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer'
                        }}
                        title="Delete Card"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} disabled={isSavingSec6}>
                <Save size={18} />
                <span>{isSavingSec6 ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 7: GLOBAL PARTNERS CMS                                            */}
      {/* ========================================================================= */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers className="text-primary" size={20} />
              <span>Section 7: Global Alliance & Brand Logos CMS</span>
            </h3>
            <p className="card-subtitle">Manage partner security brand logos displayed on the home page.</p>
          </div>
          <button type="button" onClick={handleOpenAddPartner} className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
            <Plus size={16} />
            <span>Add Partner Logo</span>
          </button>
        </div>

        <div className="card-body">
          <form onSubmit={handleSaveSec7} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Section Visibility Control */}
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <input
                type="checkbox"
                id="sec7IsVisible"
                checked={sec7IsVisible}
                onChange={(e) => setSec7IsVisible(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="sec7IsVisible" style={{ fontWeight: 600, cursor: 'pointer', margin: 0, color: 'var(--text-main)' }}>
                Show Section 7 (Brand Logos Marquee) on Main Website
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Badge Text</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec7Badge}
                  onChange={(e) => setSec7Badge(e.target.value)}
                  placeholder="e.g. GLOBAL ALLIANCE"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Heading Text</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec7Heading}
                  onChange={(e) => setSec7Heading(e.target.value)}
                  placeholder="e.g. Powered by the World's Leading Security Brands"
                />
              </div>

              {/* Background Color Picker */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Background Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={sec7BgColor}
                    onChange={(e) => setSec7BgColor(e.target.value)}
                    style={{ width: '42px', height: '38px', padding: '2px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={sec7BgColor}
                    onChange={(e) => setSec7BgColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Marquee Speed Control */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Marquee Speed (Scroll duration: {sec7Speed}s)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={sec7Speed}
                    onChange={(e) => setSec7Speed(Number(e.target.value))}
                    style={{ flex: 1, cursor: 'pointer' }}
                  />
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: '75px' }}
                    min="5"
                    max="60"
                    value={sec7Speed}
                    onChange={(e) => setSec7Speed(Number(e.target.value))}
                  />
                </div>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Lower value = Faster speed, Higher value = Slower speed</small>
              </div>
            </div>

            {/* Partner Logos Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {partnersList.map((partner, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--bg-card)' }}>
                  <img src={partner.logoUrl} alt={partner.name} style={{ maxHeight: '48px', objectFit: 'contain' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{partner.name}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                    <button type="button" onClick={() => handleOpenEditPartner(partner, idx)} className="file-upload-btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      <Edit size={12} />
                    </button>
                    <button type="button" onClick={() => handleDeletePartner(idx)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} disabled={isSavingSec7}>
                <Save size={18} />
                <span>{isSavingSec7 ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 8: STATS METRICS CMS                                              */}
      {/* ========================================================================= */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers className="text-primary" size={20} />
              <span>Section 8: Key Performance & Stats Metrics CMS</span>
            </h3>
            <p className="card-subtitle">Manage performance counter cards displayed on the home page.</p>
          </div>
          <button type="button" onClick={handleOpenAddStats} className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
            <Plus size={16} />
            <span>Add Stat Metric</span>
          </button>
        </div>

        <div className="card-body">
          <form onSubmit={handleSaveSec8} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {statsList.map((stat, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>{stat.title}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-main)' }}>{stat.subtitle}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.caption}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => handleOpenEditStats(stat, idx)} className="file-upload-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                      <Edit size={12} /> Edit
                    </button>
                    <button type="button" onClick={() => handleDeleteStats(idx)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} disabled={isSavingSec8}>
                <Save size={18} />
                <span>{isSavingSec8 ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 9: OUR GROUP STRUCTURE CMS                                       */}
      {/* ========================================================================= */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers className="text-primary" size={20} />
              <span>Section 9: Corporate Group Architecture CMS</span>
            </h3>
            <p className="card-subtitle">Manage Group Structure section, entity cards, tags, links, and disclaimers.</p>
          </div>
          <button type="button" onClick={handleOpenAddGroupCard} className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
            <Plus size={16} />
            <span>Add Group Entity</span>
          </button>
        </div>

        <div className="card-body">
          <form onSubmit={handleSaveSec9} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Section Badge</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec9GroupBadge}
                  onChange={(e) => setSec9GroupBadge(e.target.value)}
                  placeholder="e.g. CORPORATE ARCHITECTURE"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec9GroupTitle}
                  onChange={(e) => setSec9GroupTitle(e.target.value)}
                  placeholder="e.g. OUR GROUP STRUCTURE"
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label className="form-label">Section Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={sec9GroupDesc}
                onChange={(e) => setSec9GroupDesc(e.target.value)}
                placeholder="e.g. UniSpark Security is part of the UniSpark Innovations Group..."
              />
            </div>

            {/* Group Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
              {sec9GroupCards.map((card, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    {card.tag && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'inline-block' }}>
                        {card.tag}
                      </span>
                    )}
                    <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', margin: '0.25rem 0' }}>{card.title}</h4>
                    {Array.isArray(card.tags) && card.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
                        {card.tags.map((t, tIdx) => (
                          <span key={tIdx} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <button type="button" onClick={() => handleOpenEditGroupCard(card, idx)} className="file-upload-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                      <Edit size={12} /> Edit
                    </button>
                    <button type="button" onClick={() => handleDeleteGroupCard(idx)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} disabled={isSavingSec9}>
                <Save size={18} />
                <span>{isSavingSec9 ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 10: FUTURISTIC CTA CMS                                           */}
      {/* ========================================================================= */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers className="text-primary" size={20} />
            <span>Section 10: Futuristic CTA Banner & Background CMS</span>
          </h3>
          <p className="card-subtitle">Manage call-to-action text, buttons, and background image (Cloudinary connected).</p>
        </div>

        <div className="card-body">
          <form onSubmit={handleSaveSec10} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">CTA Badge</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec10CtaBadge}
                  onChange={(e) => setSec10CtaBadge(e.target.value)}
                  placeholder="e.g. NEXT-GEN INTEGRATION"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">CTA Main Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec10CtaTitle}
                  onChange={(e) => setSec10CtaTitle(e.target.value)}
                  placeholder="e.g. Let's Discuss Your Security Requirements"
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label className="form-label">CTA Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={sec10CtaDesc}
                onChange={(e) => setSec10CtaDesc(e.target.value)}
                placeholder="e.g. Whether you need a single CCTV installation..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Primary Button Text</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec10PrimaryBtnText}
                  onChange={(e) => setSec10PrimaryBtnText(e.target.value)}
                  placeholder="e.g. Request a Free Site Survey"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Primary Button Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec10PrimaryBtnLink}
                  onChange={(e) => setSec10PrimaryBtnLink(e.target.value)}
                  placeholder="e.g. /contact-us"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Secondary Button Text</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec10SecondaryBtnText}
                  onChange={(e) => setSec10SecondaryBtnText(e.target.value)}
                  placeholder="e.g. Download Company Profile"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Secondary Button Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec10SecondaryBtnLink}
                  onChange={(e) => setSec10SecondaryBtnLink(e.target.value)}
                  placeholder="e.g. /company-profile.pdf"
                />
              </div>
            </div>

            {/* CTA Background Image File Picker */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label className="form-label">CTA Section Background Image (Cloudinary Sync)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCtaBgFileSelect(e.target.files[0])}
                  className="form-control"
                  style={{ flex: 1 }}
                />
                {sec10CtaBgPreviewUrl && (
                  <img
                    src={sec10CtaBgPreviewUrl}
                    alt="CTA BG Preview"
                    style={{ width: '80px', height: '48px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                  />
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} disabled={isSavingSec10}>
                <Save size={18} />
                <span>{isSavingSec10 ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 6: CARD MODAL                                                     */}
      {/* ========================================================================= */}
      {showSec6Modal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {editingSec6Id ? 'Edit Pillar Card' : 'Add Pillar Card'}
              </h3>
              <button onClick={() => setShowSec6Modal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Title *</label>
                <input type="text" className="form-control" value={sec6ModalTitle} onChange={(e) => setSec6ModalTitle(e.target.value)} placeholder="e.g. UAE Regulatory Compliance" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
                <textarea className="form-control" rows={3} value={sec6ModalDesc} onChange={(e) => setSec6ModalDesc(e.target.value)} placeholder="e.g. All systems designed and installed..." />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>FontAwesome Icon Class</label>
                <input type="text" className="form-control" value={sec6ModalIcon} onChange={(e) => {
                  setSec6ModalIcon(e.target.value);
                  setSec6ModalImageFile(null);
                  setSec6ModalImagePreviewUrl('');
                  setSec6ModalImageBase64('');
                }} placeholder="e.g. fa-building-shield" />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR upload an image below</span>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Card Image Upload</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSec6ImageSelect(e.target.files[0])}
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  {sec6ModalImagePreviewUrl && (
                    <img src={sec6ModalImagePreviewUrl} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} />
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
              <button type="button" onClick={() => setShowSec6Modal(false)} className="file-upload-btn" style={{ padding: '0.5rem 1.25rem' }}>Cancel</button>
              <button type="button" onClick={handleSaveModalSec6} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
                {editingSec6Id ? 'Update Card' : 'Add Card'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: PARTNER MODAL                                                  */}
      {/* ========================================================================= */}
      {showPartnerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '480px', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {editingPartnerId !== null ? 'Edit Partner Logo' : 'Add Partner Logo'}
              </h3>
              <button onClick={() => setShowPartnerModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Brand Name *</label>
                <input type="text" className="form-control" value={partnerModalName} onChange={(e) => setPartnerModalName(e.target.value)} placeholder="e.g. Genetec" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Logo Upload (Cloudinary Sync)</label>
                <input type="file" accept="image/*" onChange={(e) => handlePartnerLogoSelect(e.target.files[0])} className="form-control" />
                {partnerModalLogoPreviewUrl && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={partnerModalLogoPreviewUrl} alt="Logo Preview" style={{ maxHeight: '40px', objectFit: 'contain' }} />
                  </div>
                )}
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Target Link (Optional)</label>
                <input type="text" className="form-control" value={partnerModalLink} onChange={(e) => setPartnerModalLink(e.target.value)} placeholder="e.g. https://genetec.com" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
              <button type="button" onClick={() => setShowPartnerModal(false)} className="file-upload-btn" style={{ padding: '0.5rem 1.25rem' }}>Cancel</button>
              <button type="button" onClick={handleSaveModalPartner} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
                {editingPartnerId !== null ? 'Update Partner' : 'Add Partner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: STATS MODAL                                                   */}
      {/* ========================================================================= */}
      {showStatsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '480px', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {editingStatsId !== null ? 'Edit Stat Metric' : 'Add Stat Metric'}
              </h3>
              <button onClick={() => setShowStatsModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Value / Title *</label>
                <input type="text" className="form-control" value={statsModalTitle} onChange={(e) => setStatsModalTitle(e.target.value)} placeholder="e.g. UAE-Wide" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Subtitle *</label>
                <input type="text" className="form-control" value={statsModalSubtitle} onChange={(e) => setStatsModalSubtitle(e.target.value)} placeholder="e.g. SERVICE COVERAGE" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Caption / Description</label>
                <input type="text" className="form-control" value={statsModalCaption} onChange={(e) => setStatsModalCaption(e.target.value)} placeholder="e.g. Dubai • Abu Dhabi • Sharjah & Beyond" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Icon Name</label>
                <select className="form-control" value={statsModalIcon} onChange={(e) => setStatsModalIcon(e.target.value)}>
                  <option value="MapPin">MapPin (Location)</option>
                  <option value="Building2">Building2 (Industries)</option>
                  <option value="Network">Network (Services)</option>
                  <option value="FileText">FileText (Contracts)</option>
                  <option value="ShieldCheck">ShieldCheck</option>
                  <option value="Award">Award</option>
                  <option value="CheckCircle2">CheckCircle2</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
              <button type="button" onClick={() => setShowStatsModal(false)} className="file-upload-btn" style={{ padding: '0.5rem 1.25rem' }}>Cancel</button>
              <button type="button" onClick={handleSaveModalStats} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
                {editingStatsId !== null ? 'Update Stat' : 'Add Stat'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 9: GROUP ENTITY MODAL                                            */}
      {/* ========================================================================= */}
      {showGroupModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '520px', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {editingGroupId !== null ? 'Edit Group Entity' : 'Add Group Entity'}
              </h3>
              <button onClick={() => setShowGroupModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Category Tag (e.g. GROUP LEAD TECHNOLOGY ENTITY)</label>
                <input type="text" className="form-control" value={groupModalTag} onChange={(e) => setGroupModalTag(e.target.value)} placeholder="e.g. GROUP LEAD TECHNOLOGY ENTITY" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Entity Title *</label>
                <input type="text" className="form-control" value={groupModalTitle} onChange={(e) => setGroupModalTitle(e.target.value)} placeholder="e.g. Horizon Hive Technology L.L.C" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Subtitle (e.g. Core Business:)</label>
                <input type="text" className="form-control" value={groupModalSubtitle} onChange={(e) => setGroupModalSubtitle(e.target.value)} placeholder="Core Business:" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Core Business Tags (Comma separated)</label>
                <input type="text" className="form-control" value={groupModalTagsInput} onChange={(e) => setGroupModalTagsInput(e.target.value)} placeholder="e.g. Managed IT, Cybersecurity, Aviation IT" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Icon Name</label>
                <select className="form-control" value={groupModalIcon} onChange={(e) => setGroupModalIcon(e.target.value)}>
                  <option value="Laptop">Laptop (IT / Technology)</option>
                  <option value="Users">Users (HR / Consultancy)</option>
                  <option value="ShieldCheck">ShieldCheck (Security / Equipment)</option>
                  <option value="Building2">Building2</option>
                  <option value="Network">Network</option>
                  <option value="Cpu">Cpu</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Redirect Link (Website URL or Internal Path)</label>
                <input type="text" className="form-control" value={groupModalLink} onChange={(e) => setGroupModalLink(e.target.value)} placeholder="e.g. https://www.horizonhivetechnology.com/" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Redirect Disclaimer</label>
                <textarea className="form-control" rows={2} value={groupModalDisclaimer} onChange={(e) => setGroupModalDisclaimer(e.target.value)} placeholder="e.g. You are being redirected to..." />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
              <button type="button" onClick={() => setShowGroupModal(false)} className="file-upload-btn" style={{ padding: '0.5rem 1.25rem' }}>Cancel</button>
              <button type="button" onClick={handleSaveModalGroupCard} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
                {editingGroupId !== null ? 'Update Entity' : 'Add Entity'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
