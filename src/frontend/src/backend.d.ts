import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Bid {
    id: string;
    auctionId: string;
    timestamp: Timestamp;
    bidderId: string;
    amount: number;
    isWinning: boolean;
}
export interface TutorialCompletion {
    completedAt: bigint;
    skipped: boolean;
    userId: string;
    mode: string;
    appKey: string;
}
export interface MarketDataPoint {
    id: string;
    month: bigint;
    trend: string;
    propertyType: string;
    year: bigint;
    avgPricePerSqft: bigint;
    locality: string;
}
export interface AdminStaffMember {
    id: string;
    accessLevel: string;
    canExport: boolean;
    name: string;
    createdAt: bigint;
    role: string;
    isActive: boolean;
    email: string;
    loginId: string;
    passwordHash: string;
    canDelete: boolean;
    accessSections: Array<string>;
    phone: string;
    lastLogin?: bigint;
}
export interface PropertyEnquiry {
    id: string;
    ownerEmail: string;
    customerName: string;
    status: string;
    propertyPrice: string;
    ownerName: string;
    contactedAt?: bigint;
    propertySqft: bigint;
    propertyType: string;
    customerPhone: string;
    visitDate: string;
    ownerPhone: string;
    propertyTitle: string;
    submittedAt: bigint;
    propertyId: string;
    propertyAddress: string;
    sourceTag: string;
    customerMessage: string;
    propertyBhk: string;
    agencyName: string;
    notes: string;
    preferredTime: string;
    agencyPhone: string;
    customerEmail: string;
}
export interface ExchangeEnquiry {
    id: string;
    listingId: string;
    offerPrice?: number;
    message: string;
    buyerId: string;
    timestamp: Timestamp;
}
export interface Lead {
    id: string;
    status: string;
    assignedTo: string;
    interest: string;
    propertyType: string;
    source: string;
    name: string;
    createdAt: bigint;
    tags: Array<string>;
    email: string;
    heatScore: bigint;
    score: bigint;
    stage: string;
    notes: string;
    phone: string;
    lastContact?: bigint;
    budget: string;
    location: string;
    followUpDate?: bigint;
}
export type DealStage = string;
export interface FinancialMetric {
    totalCommissions: bigint;
    averageDealSize: bigint;
    period: string;
    newLeads: bigint;
    conversionRate: bigint;
    totalRevenue: bigint;
    closedDeals: bigint;
}
export interface MediaPost {
    id: string;
    title: string;
    content: string;
    isPublished: boolean;
    views: bigint;
    createdAt: Timestamp;
    tags: Array<string>;
    publishedAt?: Timestamp;
    author: string;
    category: MediaCategory;
}
export interface AIActivityEntry {
    result: string;
    count: bigint;
    agentName: string;
    actionType: string;
    agentId: string;
    timestamp: string;
}
export interface PropertyPerformance {
    title: string;
    views: bigint;
    alerts: bigint;
    propertyId: string;
    enquiries: bigint;
    price: bigint;
    location: string;
}
export interface AISystemConfig {
    totalAgents: bigint;
    openAIKeySet: boolean;
    activeProvider: string;
    fallbackOrder: Array<string>;
    claudeKeySet: boolean;
    activeAgents: bigint;
    geminiKeySet: boolean;
}
export interface TutorialApp {
    appName: string;
    quickStepCount: bigint;
    appKey: string;
    fullStepCount: bigint;
}
export interface LegalDoc {
    id: string;
    title: string;
    createdAt: bigint;
    version: bigint;
    docStatus: string;
    updatedAt: bigint;
    signedBy: Array<string>;
    category: string;
    riskScore: bigint;
}
export interface PartnerApplication {
    id: string;
    status: string;
    areas: string;
    name: string;
    createdAt: bigint;
    email: string;
    experience: string;
    company: string;
    notes: string;
    phone: string;
}
export interface SecurityEvent {
    id: bigint;
    staffId: string;
    deviceId: string;
    timestamp: bigint;
    details: string;
    ipAddress: string;
    eventType: SecurityEventType;
}
export interface CommandResult {
    data: string;
    message: string;
    success: boolean;
}
export interface AiDecision {
    id: string;
    decisionType: AiDecisionType;
    reversalReason: string;
    agentName: string;
    description: string;
    confidenceScore: bigint;
    reversed: boolean;
    timestamp: bigint;
    reversedAt?: bigint;
    reversible: boolean;
    outcome: string;
    actionTaken: string;
}
export interface Proposal {
    id: bigint;
    status: string;
    expiresAt: bigint;
    clientName: string;
    createdAt: bigint;
    propertyTitle: string;
    notes: string;
    amount: bigint;
}
export interface ObserverCode {
    id: bigint;
    lastUsedAt?: bigint;
    permissions: Array<string>;
    useCount: bigint;
    expiresAt?: bigint;
    code: string;
    createdAt: bigint;
    createdBy: string;
    expiryType: string;
    labelText: string;
    isActive: boolean;
}
export interface DashboardStats {
    tasksCompletedToday: bigint;
    totalProperties: bigint;
    totalLeads: bigint;
    totalCallbacks: bigint;
    totalEnquiries: bigint;
    totalFeedback: bigint;
    activeAgents: bigint;
    totalInteractions: bigint;
}
export interface ExchangeListing {
    id: string;
    status: ListingStatus;
    createdAt: Timestamp;
    description: string;
    propertyId: string;
    askPrice: number;
    viewCount: bigint;
    enquiries: Array<ExchangeEnquiry>;
    sellerId: string;
}
export interface CommissionRecord {
    id: string;
    status: CommissionStatus;
    approvedBy?: string;
    createdAt: Timestamp;
    agentId: string;
    dealId: string;
    amount: number;
    paidAt?: Timestamp;
    percentage: number;
}
export interface Notification {
    id: string;
    title: string;
    createdAt: bigint;
    type: string;
    isRead: boolean;
    message: string;
    relatedId?: string;
}
export interface TutorialStep {
    id: bigint;
    title: string;
    content: string;
    stepIndex: bigint;
    order: bigint;
    targetElement?: string;
    mode: string;
    isActive: boolean;
    appKey: string;
}
export interface DailyBriefing {
    id: string;
    marketNews: Array<string>;
    dealsMovingCount: bigint;
    revenueFigure: number;
    generatedSummary: string;
    date: string;
    createdAt: bigint;
    newLeadsCount: bigint;
    securityEventsCount: bigint;
    tasksDueCount: bigint;
}
export interface DealNote {
    id: string;
    content: string;
    authorId: string;
    dealId: string;
    timestamp: Timestamp;
}
export type CommissionStatus = string;
export type ListingStatus = string;
export interface RichSecurityEvent {
    id: string;
    aiTierId: string;
    resolved: boolean;
    description: string;
    sourceIp: string;
    timestamp: bigint;
    severity: string;
    resolvedAt?: bigint;
    eventType: string;
}
export interface SocietyReview {
    id: string;
    review: string;
    isApproved: boolean;
    createdAt: bigint;
    security: bigint;
    amenities: bigint;
    maintenance: bigint;
    rating: bigint;
    management: bigint;
    reviewerAlias: string;
    societyName: string;
}
export interface SecurityHealthReport {
    canaryTriggered: boolean;
    overallScore: bigint;
    recommendations: Array<string>;
    generatedAt: bigint;
    lockoutsLast24h: bigint;
    failedLoginsLast24h: bigint;
    activeSessions: bigint;
    pendingBiometrics: bigint;
    suspendedAccounts: bigint;
    threatsBlocked: bigint;
}
export interface ObserverCodeRecord {
    expiresAt: bigint;
    isRevoked: boolean;
    code: string;
    createdBy: string;
    used: boolean;
    observerLabel: string;
    scope: string;
    singleUse: boolean;
}
export interface CallbackRequest {
    id: string;
    service: string;
    name: string;
    pageName: string;
    isRead: boolean;
    timestamp: bigint;
    phone: string;
}
export interface CommissionInvoice {
    id: bigint;
    status: string;
    serviceType: string;
    clientName: string;
    createdAt: bigint;
    dueDate: bigint;
    description: string;
    commission: bigint;
    paidDate?: bigint;
    amount: bigint;
}
export interface Staff {
    id: string;
    firstLoginDone: boolean;
    name: string;
    createdAt: bigint;
    role: StaffRole;
    biometricPublicKey: string;
    mobileNumber: string;
    isActive: boolean;
    email: string;
    loginAttempts: bigint;
    biometricEnrolled: boolean;
    deviceId: string;
    sessionToken: string;
    isSuspended: boolean;
    passwordHash: string;
    lastLogin: bigint;
    lockedUntil: bigint;
}
export interface AppNotification {
    id: bigint;
    title: string;
    appName: string;
    createdAt: bigint;
    isRead: boolean;
    message: string;
    targetRole: string;
    priority: string;
}
export interface Announcement {
    id: string;
    title: string;
    expiresAt?: bigint;
    createdAt: bigint;
    isActive: boolean;
    ctaText: string;
    message: string;
    ctaUrl: string;
    bgColor: string;
    scheduledAt?: bigint;
}
export interface MarketReport {
    id: string;
    month: string;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: bigint;
    year: string;
}
export interface PropertyAlert {
    id: string;
    bhk: string;
    action: string;
    propertyType: string;
    name: string;
    createdAt: bigint;
    email: string;
    phone: string;
    location: string;
    maxBudget: bigint;
}
export interface FormStats {
    todayCallbacks: bigint;
    unreadQuotes: bigint;
    todayFeedback: bigint;
    totalCallbacks: bigint;
    unreadMoreInfo: bigint;
    totalMoreInfo: bigint;
    todayQuotes: bigint;
    unreadFeedback: bigint;
    totalQuotes: bigint;
    totalFeedback: bigint;
    unreadSupport: bigint;
    todaySupport: bigint;
    totalSupport: bigint;
    unreadCallbacks: bigint;
}
export interface Deal {
    id: string;
    actualCloseDate?: Timestamp;
    title: string;
    documents: Array<string>;
    clientId: string;
    createdAt: Timestamp;
    agentId: string;
    propertyId: string;
    expectedCloseDate: Timestamp;
    stage: DealStage;
    notes: string;
    commissionAmount: number;
}
export interface Booking {
    id: string;
    status: BookingStatus;
    clientId: string;
    createdAt: Timestamp;
    agentId: string;
    propertyId: string;
    notes: string;
    bookingType: BookingType;
    scheduledAt: Timestamp;
}
export interface PropertyIntelligence {
    latitude: number;
    builderTrustScore: bigint;
    propertyId: string;
    amenities: Array<string>;
    updatedAt: bigint;
    longitude: number;
    investmentGrade: InvestmentGrade;
    negotiationMax: bigint;
    negotiationMin: bigint;
    reraNumber: string;
    builderId: string;
}
export interface BlogPost {
    id: string;
    metaDescription: string;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: bigint;
    slug: string;
    author: string;
    updatedAt: bigint;
    excerpt: string;
    category: string;
}
export interface ThreatIntelEntry {
    id: string;
    isBlocked: boolean;
    detectedAt: bigint;
    severity: string;
    ipAddress: string;
    reason: string;
}
export interface Invoice {
    id: string;
    service: string;
    status: string;
    clientName: string;
    createdAt: bigint;
    clientEmail: string;
    invoiceNumber: string;
    totalAmount: number;
    notes: string;
    clientPhone: string;
    taxAmount: number;
}
export interface MoreInfoRequest {
    id: string;
    service: string;
    question: string;
    name: string;
    pageName: string;
    isRead: boolean;
    email: string;
    timestamp: bigint;
}
export interface ReviewRecord {
    id: bigint;
    responded: boolean;
    sentiment: string;
    reviewDate: bigint;
    reviewText: string;
    reviewerName: string;
    platform: string;
    rating: bigint;
    responseText?: string;
}
export interface LeadNurtureReminder {
    id: string;
    service: string;
    leadName: string;
    reminderDays: bigint;
    leadId: string;
    isDismissed: boolean;
    phone: string;
    lastContactedAt: bigint;
}
export type VendorJobStatus = string;
export interface SupportForm {
    id: string;
    service: string;
    name: string;
    isRead: boolean;
    email: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface Feedback {
    id: string;
    pageName: string;
    isRead: boolean;
    comment: string;
    timestamp: bigint;
    rating: bigint;
}
export interface AuditEntry {
    id: string;
    result: string;
    action: string;
    actorId: string;
    target: string;
    timestamp: bigint;
    details: string;
    ipAddress: string;
}
export interface SiteVisit {
    id: string;
    status: string;
    clientName: string;
    scheduledDate: bigint;
    scheduledTime: string;
    createdAt: bigint;
    propertyAddress: string;
    notes: string;
    clientPhone: string;
}
export interface MusicArtist {
    id: string;
    bio: string;
    name: string;
    instagramUrl: string;
    available: boolean;
    bookingContact: string;
    genre: string;
    specialties: Array<string>;
    youtubeUrl: string;
}
export interface Session {
    staffId: string;
    lastActivity: bigint;
    createdAt: bigint;
    isActive: boolean;
    deviceId: string;
    sessionId: string;
    userAgent: string;
    ipAddress: string;
}
export interface LocalityDemand {
    lastUpdated: bigint;
    viewCount: bigint;
    enquiryCount: bigint;
    locality: string;
}
export interface Lesson {
    id: string;
    title: string;
    duration: bigint;
    content: string;
    order: bigint;
    videoUrl?: string;
    courseId: string;
}
export interface Deal__1 {
    id: string;
    service: string;
    clientName: string;
    createdAt: bigint;
    clientEmail: string;
    updatedAt: bigint;
    stage: string;
    notes: string;
    clientPhone: string;
    followUpDate?: bigint;
}
export interface DashboardStat {
    key: string;
    value: bigint;
    period: string;
    icon: string;
    change: bigint;
    statLabel: string;
}
export interface VendorJob {
    id: string;
    status: VendorJobStatus;
    completedAt?: Timestamp;
    jobType: string;
    createdAt: Timestamp;
    propertyId: string;
    vendorId: string;
    amount: number;
}
export interface Lead__1 {
    id: bigint;
    service: string;
    assignedTo: string;
    source: string;
    name: string;
    createdAt: bigint;
    email: string;
    score: string;
    updatedAt: bigint;
    stage: string;
    notes: string;
    estimatedValue: bigint;
    phone: string;
}
export interface TimeSlot {
    date: string;
    slots: Array<string>;
    bookedSlots: Array<string>;
}
export interface QuoteRequest {
    id: string;
    service: string;
    name: string;
    pageName: string;
    isRead: boolean;
    email: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface SatisfactionRating {
    id: string;
    submittedAt: bigint;
    feedback: string;
    enquiryId: string;
    rating: bigint;
}
export interface Service {
    id: bigint;
    icon: string;
    name: string;
    slug: string;
    description: string;
}
export interface DeviceRecord {
    id: string;
    status: DeviceStatus;
    staffId: string;
    lastSeenAt: bigint;
    trustScore: bigint;
    deviceId: string;
    userAgent: string;
    registeredAt: bigint;
    ipAddress: string;
}
export interface CrmAppointment {
    id: bigint;
    status: string;
    durationMins: bigint;
    clientName: string;
    createdBy: string;
    type: string;
    notes: string;
    location: string;
    scheduledAt: bigint;
}
export interface RSVP {
    id: bigint;
    status: string;
    eventId: bigint;
    guestCount: bigint;
    guestName: string;
    email: string;
    phone: string;
}
export interface EventBooking {
    id: string;
    status: string;
    clientName: string;
    venue: string;
    guestCount: string;
    createdAt: bigint;
    clientEmail: string;
    notes: string;
    clientPhone: string;
    eventDate: string;
    eventType: string;
}
export type BookingType = string;
export interface AIAgent {
    id: string;
    name: string;
    tier: string;
    description: string;
    actionsLog: Array<string>;
    isActive: boolean;
    category: string;
    config: string;
    parentId?: string;
    lastAction: string;
}
export interface LeadQualification {
    id: string;
    propertyType: string;
    createdAt: bigint;
    leadScore: string;
    sessionId: string;
    budget: string;
    location: string;
}
export interface Appointment {
    id: string;
    service: string;
    status: string;
    clientName: string;
    createdAt: bigint;
    type: string;
    clientEmail: string;
    preferredDate: string;
    notes: string;
    clientPhone: string;
    preferredTime: string;
}
export interface AgentActivity {
    status: string;
    result: string;
    action: string;
    agentName: string;
    agentId: string;
    timestamp: bigint;
    cluster: string;
}
export type Timestamp = bigint;
export interface JantriRate {
    area: string;
    updatedAt: bigint;
    ratePerSqFt: bigint;
    effectiveFrom: string;
}
export type BookingStatus = string;
export interface Enrollment {
    id: string;
    completedAt?: Timestamp;
    studentId: string;
    progress: bigint;
    completedLessons: Array<string>;
    enrolledAt: Timestamp;
    courseId: string;
}
export interface PropertyListing {
    id: string;
    bhk: string;
    ownerEmail: string;
    title: string;
    action: string;
    ownerName: string;
    propertyType: string;
    mapLink: string;
    city: string;
    sqft: bigint;
    listedDate: string;
    ownerPhone: string;
    description: string;
    sourceTag: string;
    amenities: Array<string>;
    address: string;
    agencyName: string;
    priceDisplay: string;
    price: bigint;
    agencyPhone: string;
    furnishing: string;
    possession: string;
    facing: string;
    location: string;
    floorNo: bigint;
    societyName: string;
    images: Array<string>;
}
export interface Course {
    id: string;
    title: string;
    duration: bigint;
    isPublished: boolean;
    instructor: string;
    createdAt: Timestamp;
    description: string;
    lessons: Array<Lesson>;
    category: string;
    enrolledCount: bigint;
}
export interface AuditRecord {
    id: bigint;
    action: string;
    staffId: string;
    target: string;
    deviceId: string;
    timestamp: bigint;
    details: string;
    ipAddress: string;
}
export interface Property {
    id: string;
    status: string;
    title: string;
    propertyType: string;
    views: bigint;
    area: string;
    createdAt: bigint;
    tags: Array<string>;
    type: string;
    builderName: string;
    description: string;
    amenities: Array<string>;
    listingDate: bigint;
    enquiries: bigint;
    areaRaw: bigint;
    price: string;
    priceRaw: bigint;
    location: string;
    reraNumber?: string;
    images: Array<string>;
}
export interface Client__1 {
    id: bigint;
    ltv: bigint;
    clientType: string;
    totalValue: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    notes: string;
    phone: string;
    lastContact: bigint;
    totalDeals: bigint;
}
export interface AIInsight {
    id: string;
    status: string;
    title: string;
    content: string;
    createdAt: string;
    agentId: string;
    priority: string;
}
export interface Campaign {
    id: bigint;
    status: string;
    title: string;
    messagePreview: string;
    createdAt: bigint;
    audience: string;
    sentCount: bigint;
    replyCount: bigint;
    openCount: bigint;
    channel: string;
    scheduledAt?: bigint;
}
export interface VisitRequest {
    id: string;
    customerName: string;
    status: string;
    customerPhone: string;
    createdAt: bigint;
    propertyTitle: string;
    visitType: string;
    propertyId: string;
    preferredDate: string;
    preferredTime: string;
    customerEmail: string;
}
export interface Referral {
    id: string;
    clicks: bigint;
    referrerName: string;
    code: string;
    createdAt: bigint;
    referrerEmail: string;
    enquiries: Array<string>;
    referrerPhone: string;
}
export interface Client {
    id: string;
    status: string;
    totalValue: string;
    name: string;
    createdAt: bigint;
    joinedAt: bigint;
    buyingReadiness: string;
    type: string;
    lastUpdated: bigint;
    email: string;
    lifetimeValue: bigint;
    address: string;
    notes: string;
    phone: string;
    totalDeals: bigint;
    lastInteraction?: bigint;
}
export interface Vendor {
    id: string;
    contactName: string;
    name: string;
    createdAt: Timestamp;
    totalJobs: bigint;
    isActive: boolean;
    email: string;
    notes: string;
    category: string;
    rating: number;
    phone: string;
}
export interface CanaryToken {
    id: string;
    createdAt: bigint;
    triggeredAt?: bigint;
    triggeredBy: string;
    tokenValue: string;
    isTriggered: boolean;
    tokenLabel: string;
}
export interface ComplaintTicket {
    id: string;
    service: string;
    customerName: string;
    status: string;
    createdAt: bigint;
    notes: string;
    issue: string;
    phone: string;
    refNumber: string;
    resolvedAt?: bigint;
}
export interface InterestRateEntry {
    bank: string;
    rate: number;
}
export interface AnniversaryReminder {
    id: string;
    clientName: string;
    createdAt: bigint;
    email: string;
    reminderDate: string;
    reminderType: string;
    notes: string;
    phone: string;
}
export interface ObserverAccessLog {
    id: string;
    code: string;
    scope: string;
    timestamp: bigint;
    sessionId: string;
}
export interface CsrImpactEntry {
    id: string;
    metric: string;
    value: bigint;
    year: bigint;
    description: string;
    updatedAt: bigint;
    category: string;
}
export interface TutorialSuggestion {
    id: bigint;
    status: string;
    stepIndex: bigint;
    mode: string;
    createdAt: bigint;
    suggestedContent: string;
    appKey: string;
    reason: string;
}
export interface BuilderProfile {
    id: string;
    contact: string;
    about: string;
    ongoingProjects: bigint;
    name: string;
    registeredSince: string;
    localities: Array<string>;
    isVerified: boolean;
    completedProjects: bigint;
    rating: number;
    reraNumber: string;
}
export interface Event_ {
    id: bigint;
    status: string;
    title: string;
    venue: string;
    type: string;
    description: string;
    confirmedCount: bigint;
    capacity: bigint;
    budget: bigint;
    scheduledAt: bigint;
}
export interface AuctionListing {
    id: string;
    status: string;
    title: string;
    features: Array<string>;
    propertyType: string;
    minimumBid: bigint;
    description: string;
    watchCount: bigint;
    currentBid: bigint;
    bidCount: bigint;
    startPrice: bigint;
    location: string;
    endsAt: bigint;
}
export type AuctionStatus = string;
export interface PriceHistoryEntry {
    note: string;
    propertyId: string;
    recordedAt: bigint;
    recordedBy: string;
    price: bigint;
}
export interface ChatInteraction {
    id: bigint;
    messageLength: bigint;
    userMessage: string;
    timestamp: bigint;
    sessionId: string;
    sentimentTag: string;
    botResponse: string;
}
export interface Auction {
    id: string;
    startTime: Timestamp;
    status: AuctionStatus;
    title: string;
    endTime: Timestamp;
    winnerId?: string;
    bids: Array<Bid>;
    description: string;
    propertyId: string;
    currentBid: number;
    startPrice: number;
    bidIncrement: number;
}
export interface NewsArticle {
    url: string;
    title: string;
    source: string;
    publishedAt: string;
    summary: string;
    imageUrl: string;
}
export interface ServiceSubmission {
    id: bigint;
    submitterPhone: string;
    serviceCategory: string;
    submitterName: string;
    innerPage: string;
    formType: string;
    isRead: boolean;
    fields: Array<[string, string]>;
    indemnityAccepted: boolean;
    timestamp: bigint;
    submitterEmail: string;
}
export interface BuilderTrustRecord {
    deliveryScore: bigint;
    trustScore: bigint;
    lastUpdated: bigint;
    builderName: string;
    complaintCount: bigint;
    reraFilingCount: bigint;
    builderId: string;
}
export type MediaCategory = string;
export interface ObserverCodeInfo {
    codeLabel: string;
    active: boolean;
    expiresAt?: bigint;
    code: string;
    usedAt?: bigint;
    usedBy?: string;
    createdAt: bigint;
    createdBy: string;
    used: boolean;
    scope: Array<string>;
    singleUse: boolean;
}
export enum AiDecisionType {
    BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
    SECURITY_BLOCKED = "SECURITY_BLOCKED",
    ANOMALY_FLAGGED = "ANOMALY_FLAGGED",
    MINOR_UI_FIX = "MINOR_UI_FIX",
    LEAD_SCORED = "LEAD_SCORED",
    COMMISSION_CALCULATED = "COMMISSION_CALCULATED",
    FOLLOW_UP_SENT = "FOLLOW_UP_SENT",
    PROPERTY_PUBLISHED = "PROPERTY_PUBLISHED",
    OTHER = "OTHER",
    CONTENT_PUBLISHED = "CONTENT_PUBLISHED"
}
export enum DeviceStatus {
    trusted = "trusted",
    revoked = "revoked",
    pending = "pending",
    blocked = "blocked"
}
export enum InvestmentGrade {
    buy = "buy",
    avoid = "avoid",
    hold = "hold"
}
export enum SecurityEventType {
    CANARY_TRIGGERED = "CANARY_TRIGGERED",
    OTP_FAIL = "OTP_FAIL",
    OTP_SENT = "OTP_SENT",
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    EMERGENCY_LOCKDOWN = "EMERGENCY_LOCKDOWN",
    FORCE_LOGOUT = "FORCE_LOGOUT",
    LOCKOUT = "LOCKOUT",
    BIOMETRIC_ENROLL = "BIOMETRIC_ENROLL",
    LOGIN_FAIL = "LOGIN_FAIL",
    ANOMALY_DETECTED = "ANOMALY_DETECTED"
}
export enum StaffRole {
    manager = "manager",
    admin = "admin",
    agent = "agent",
    viewer = "viewer"
}
export interface backendInterface {
    addAIInsight(insight: AIInsight): Promise<boolean>;
    addActiveVisitor(visitorId: string): Promise<void>;
    addAnniversaryReminder(clientName: string, phone: string, email: string, reminderDate: string, reminderType: string, notes: string): Promise<string>;
    addAnnouncement(title: string, message: string, ctaText: string, ctaUrl: string, bgColor: string, scheduledAt: bigint | null, expiresAt: bigint | null): Promise<string>;
    addAppointment(clientName: string, clientPhone: string, clientEmail: string, type: string, service: string, preferredDate: string, preferredTime: string, notes: string): Promise<string>;
    addBlogPost(title: string, slug: string, content: string, excerpt: string, category: string, author: string, metaDescription: string): Promise<string>;
    addBuilderProfile(name: string, reraNumber: string, registeredSince: string, completedProjects: bigint, ongoingProjects: bigint, rating: number, localities: Array<string>, about: string, contact: string): Promise<string>;
    addCampaign(title: string, channel: string, audience: string, messagePreview: string): Promise<Campaign>;
    addClient(name: string, phone: string, email: string, address: string, notes: string): Promise<string>;
    addCommissionInvoice(clientName: string, serviceType: string, amount: bigint, commission: bigint, dueDate: bigint, description: string): Promise<CommissionInvoice>;
    addCrmAppointment(clientName: string, type: string, scheduledAt: bigint, durationMins: bigint, location: string, notes: string): Promise<CrmAppointment>;
    addCrmNotification(appName: string, title: string, message: string, priority: string, targetRole: string): Promise<AppNotification>;
    addDeal(clientName: string, clientPhone: string, clientEmail: string, service: string): Promise<string>;
    addDealCounterUpdate(count: bigint, desc: string): Promise<boolean>;
    addDealNote(dealId: string, authorId: string, content: string): Promise<{
        __kind__: "ok";
        ok: DealNote;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Add an enquiry for a property (frontend-facing convenience wrapper).
     */
    addEnquiry(propertyId: string, customerName: string, customerPhone: string, customerEmail: string, customerMessage: string, preferredTime: string, visitDate: string): Promise<string>;
    addEvent(title: string, type: string, scheduledAt: bigint, venue: string, capacity: bigint, budget: bigint, description: string): Promise<Event_>;
    addEventBooking(clientName: string, clientPhone: string, clientEmail: string, eventType: string, eventDate: string, guestCount: string, venue: string, notes: string): Promise<string>;
    addInvoice(invoiceNumber: string, clientName: string, clientPhone: string, clientEmail: string, service: string, totalAmount: number, taxAmount: number, notes: string): Promise<string>;
    addLead(name: string, phone: string, email: string, interest: string, budget: bigint): Promise<string>;
    addLeadNote(id: string, note: string): Promise<boolean>;
    addLeadNurtureReminder(leadId: string, leadName: string, phone: string, service: string, reminderDays: bigint): Promise<boolean>;
    addLegalDoc(doc: {
        title: string;
        docStatus: string;
        signedBy: Array<string>;
        category: string;
        riskScore: bigint;
    }): Promise<string>;
    addLesson(courseId: string, title: string, content: string, order: bigint): Promise<{
        __kind__: "ok";
        ok: Lesson;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addMarketData(d: {
        month: bigint;
        trend: string;
        propertyType: string;
        year: bigint;
        avgPricePerSqft: bigint;
        locality: string;
    }): Promise<string>;
    addMarketReport(title: string, month: string, year: string, content: string): Promise<string>;
    addMusicArtist(adminToken: string, name: string, genre: string, bio: string, specialties: Array<string>, youtubeUrl: string, instagramUrl: string, bookingContact: string, available: boolean): Promise<string>;
    addNotification(type: string, title: string, message: string, relatedId: string | null): Promise<string>;
    addPartnerApplication(name: string, phone: string, email: string, company: string, experience: string, areas: string): Promise<string>;
    addPriceHistory(adminToken: string, propertyId: string, price: bigint, date: string, note: string): Promise<boolean>;
    addProperty(title: string, propertyType: string, location: string, price: bigint, area: bigint, description: string): Promise<string>;
    addProposal(clientName: string, propertyTitle: string, amount: bigint, expiresAt: bigint, notes: string): Promise<Proposal>;
    addRSVP(eventId: bigint, guestName: string, phone: string, email: string, guestCount: bigint): Promise<RSVP>;
    addReview(platform: string, reviewerName: string, rating: bigint, reviewText: string): Promise<ReviewRecord>;
    addSiteVisit(clientName: string, clientPhone: string, propertyAddress: string, scheduledDate: bigint, scheduledTime: string, notes: string): Promise<string>;
    addStaff(id: string, name: string, email: string, passwordHash: string, role: StaffRole, mobileNumber: string): Promise<boolean>;
    addStaffMember(name: string, role: string, email: string, phone: string, loginId: string, password: string, accessSections: Array<string>, accessLevel: string, canExport: boolean, canDelete: boolean): Promise<string>;
    addThreatEntry(ipAddress: string, reason: string, severity: string): Promise<{
        __kind__: "ok";
        ok: ThreatIntelEntry;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addTutorialStep(step: {
        title: string;
        appId: string;
        stepIndex: bigint;
        targetElement: string;
        description: string;
        stepType: string;
    }): Promise<string>;
    addVendor(name: string, category: string, contactName: string, phone: string, email: string): Promise<{
        __kind__: "ok";
        ok: Vendor;
    } | {
        __kind__: "err";
        err: string;
    }>;
    approveBiometric(staffId: string, adminPasswordHash: string): Promise<boolean>;
    approveCommission(commissionId: string, approvedBy: string): Promise<{
        __kind__: "ok";
        ok: CommissionRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    approveDevice(staffId: string, deviceId: string): Promise<{
        __kind__: "ok";
        ok: DeviceRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    approveSocietyReview(id: string): Promise<boolean>;
    approveTutorialSuggestion(id: bigint): Promise<boolean>;
    assignLead(id: string, staffId: string): Promise<boolean>;
    assignVendorJob(vendorId: string, propertyId: string, jobType: string, amount: number): Promise<{
        __kind__: "ok";
        ok: VendorJob;
    } | {
        __kind__: "err";
        err: string;
    }>;
    authenticateFingerprint(staffId: string, credentialId: string, deviceId: string, ipAddress: string, userAgent: string): Promise<{
        ok: boolean;
        role: string;
        message: string;
        sessionId: string;
    }>;
    authenticateStaff(username: string, passwordHash: string, deviceId: string, ipAddress: string, userAgent: string): Promise<{
        ok: boolean;
        role: string;
        message: string;
        sessionId: string;
    }>;
    authenticateWithToken(identifier: string, passwordHash: string): Promise<{
        token: string;
        staffId: string;
        role: string;
    } | null>;
    bulkAddProperties(adminToken: string, listings: Array<PropertyListing>): Promise<{
        added: bigint;
        skipped: bigint;
        errors: Array<{
            id: string;
            rowIndex: bigint;
            reason: string;
        }>;
        updated: bigint;
    }>;
    bulkSetTutorialSteps(appKey: string, mode: string, steps: Array<TutorialStep>): Promise<boolean>;
    calculateCommission(dealId: string, staffId: string, salePrice: number, percentage: number): Promise<string>;
    clearAllInteractions(): Promise<void>;
    clearOldAuditEntries(beforeTimestamp: bigint): Promise<bigint>;
    createAuction(propertyId: string, title: string, startPrice: number, startTime: bigint, endTime: bigint): Promise<{
        __kind__: "ok";
        ok: Auction;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createBooking(propertyId: string, clientId: string, agentId: string, bookingType: string, scheduledAt: bigint): Promise<{
        __kind__: "ok";
        ok: Booking;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createClient(name: string, phone: string, email: string, clientType: string, notes: string): Promise<string>;
    createCommissionRecord(dealId: string, agentId: string, amount: number, percentage: number): Promise<{
        __kind__: "ok";
        ok: CommissionRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCourse(title: string, description: string, category: string, instructor: string): Promise<{
        __kind__: "ok";
        ok: Course;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createDailyBriefing(date: string, newLeadsCount: bigint, dealsMovingCount: bigint, revenueFigure: number, securityEventsCount: bigint, marketNews: Array<string>, tasksDueCount: bigint, generatedSummary: string): Promise<{
        __kind__: "ok";
        ok: DailyBriefing;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createDeal(title: string, propertyId: string, clientId: string): Promise<{
        __kind__: "ok";
        ok: Deal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createLead(name: string, phone: string, email: string, source: string, budget: string, propertyType: string, location: string): Promise<string>;
    createListing(sellerId: string, propertyId: string, askPrice: number, description: string): Promise<{
        __kind__: "ok";
        ok: ExchangeListing;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createMediaPost(title: string, content: string, category: string, author: string, tags: Array<string>): Promise<{
        __kind__: "ok";
        ok: MediaPost;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createObserverCode(labelText: string, permissions: Array<string>, expiryType: string, durationHours: bigint | null): Promise<ObserverCode>;
    createProperty(title: string, propertyType: string, location: string, price: bigint, priceText: string, area: bigint, areaText: string, description: string, amenities: Array<string>, reraNumber: string | null, builderName: string, tags: Array<string>, images: Array<string>): Promise<string>;
    createReferral(referrerName: string, referrerPhone: string, referrerEmail: string): Promise<string>;
    createSession(staffId: string, deviceId: string, ipAddress: string, userAgent: string): Promise<string | null>;
    createSessionSimple(staffId: string, deviceInfo: string, ip: string): Promise<string>;
    createStaff(username: string, passwordHash: string, role: StaffRole, mobileNumber: string): Promise<{
        id: string;
        ok: boolean;
        message: string;
    }>;
    createStaffWithRole(name: string, roleText: string, email: string, passwordHash: string): Promise<string>;
    deactivateStaffMember(targetId: string): Promise<boolean>;
    deleteAnniversaryReminder(id: string): Promise<boolean>;
    deleteAnnouncement(id: string): Promise<boolean>;
    deleteBuilderProfile(id: string): Promise<boolean>;
    deleteCallback(id: string): Promise<boolean>;
    deleteClient(id: string): Promise<boolean>;
    deleteComplaint(id: string): Promise<boolean>;
    deleteFeedback(id: string): Promise<boolean>;
    deleteInteraction(id: bigint): Promise<boolean>;
    deleteLead(id: string): Promise<boolean>;
    deleteMoreInfo(id: string): Promise<boolean>;
    deleteObserverCode(id: bigint): Promise<boolean>;
    deleteProperty(id: string): Promise<boolean>;
    deletePropertyAlert(id: string): Promise<boolean>;
    deleteQuote(id: string): Promise<boolean>;
    deleteReferral(id: string): Promise<boolean>;
    deleteSocietyReview(id: string): Promise<boolean>;
    deleteSubmission(id: bigint): Promise<boolean>;
    deleteSupport(id: string): Promise<boolean>;
    deleteTutorialStep(id: bigint): Promise<boolean>;
    dismissLeadReminder(id: string): Promise<boolean>;
    emergencyLockdown(adminPasswordHash: string): Promise<boolean>;
    emergencyLockdownCount(): Promise<bigint>;
    enrollBiometric(staffId: string, publicKey: string): Promise<boolean>;
    enrollBiometricWithAdmin(staffId: string, adminToken: string, credentialId: string): Promise<boolean>;
    enrollFingerprint(staffId: string, credentialId: string, publicKey: string): Promise<boolean>;
    enrollStudent(courseId: string, studentId: string): Promise<{
        __kind__: "ok";
        ok: Enrollment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    executeCommand(command: string): Promise<CommandResult>;
    fetchLatestNews(): Promise<Array<NewsArticle>>;
    fetchPropertyDataFromPortals(): Promise<bigint>;
    /**
     * / Force logout a specific staff member by staffId (removes all their sessions).
     */
    forceLogout(staffId: string): Promise<boolean>;
    forceLogoutStaff(staffId: string): Promise<boolean>;
    generateObserverCode(observerLabel: string, expiresAt: bigint, singleUse: boolean, scope: string): Promise<string>;
    generateObserverCodeInfo(codeLabel: string, adminToken: string, expiresIn: bigint | null, singleUse: boolean, scope: Array<string>): Promise<string>;
    generateOtp(staffId: string): Promise<boolean>;
    getAIAgent(id: string): Promise<AIAgent | null>;
    getAIAgentStats(): Promise<{
        agentsActiveNow: bigint;
        documentsAnalyzedToday: bigint;
        leadsProcessedToday: bigint;
        propertiesAddedToday: bigint;
        totalInteractionsToday: bigint;
        chatMessagesProcessedToday: bigint;
        complianceChecksToday: bigint;
        contentGeneratedToday: bigint;
    }>;
    getAIAgents(): Promise<Array<[string, AIAgent]>>;
    getAIAgentsByParent(parentId: string): Promise<Array<[string, AIAgent]>>;
    getAIAgentsByTier(tier: string): Promise<Array<[string, AIAgent]>>;
    getAIInsights(): Promise<Array<[string, AIInsight]>>;
    getAIStaffActivityFeed(): Promise<Array<AIActivityEntry>>;
    getAISystemConfig(): Promise<AISystemConfig>;
    getActiveAnnouncements(): Promise<Array<Announcement>>;
    getActiveSessionInfos(): Promise<Array<Session>>;
    getActiveSessions(): Promise<Array<Session>>;
    getActiveVisitorCount(): Promise<bigint>;
    getAgentActivitiesByCluster(cluster: string, limit: bigint): Promise<Array<AgentActivity>>;
    getAgentBookings(agentId: string): Promise<Array<Booking>>;
    getAgentCommissions(agentId: string): Promise<Array<CommissionRecord>>;
    getAiDecision(decisionId: string): Promise<{
        __kind__: "ok";
        ok: AiDecision;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllComplaints(): Promise<Array<ComplaintTicket>>;
    getAllDevices(): Promise<Array<DeviceRecord>>;
    getAllObserverCodes(): Promise<Array<ObserverCode>>;
    getAllReferrals(): Promise<Array<Referral>>;
    getAllServices(): Promise<Array<Service>>;
    getAllSocietyReviews(): Promise<Array<SocietyReview>>;
    getAllStaff(): Promise<Array<Staff>>;
    getAllTutorialApps(): Promise<Array<TutorialApp>>;
    getAnalyticsSummary(): Promise<{
        thisMonthEnquiries: bigint;
        peakHours: Array<[string, bigint]>;
        topLocations: Array<[string, bigint]>;
        totalEnquiries: bigint;
        topBudgetRanges: Array<[string, bigint]>;
        topPropertyTypes: Array<[string, bigint]>;
        thisWeekEnquiries: bigint;
    }>;
    getAnniversaryReminders(): Promise<Array<AnniversaryReminder>>;
    getAppointments(): Promise<Array<Appointment>>;
    getAuction(auctionId: string): Promise<{
        __kind__: "ok";
        ok: Auction;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAuctionBids(auctionId: string): Promise<Array<Bid>>;
    getAuctionListings(): Promise<Array<AuctionListing>>;
    getAuditLog(limit: bigint, offset: bigint): Promise<Array<AuditRecord>>;
    getAuditLogByActor(actorId: string): Promise<Array<AuditEntry>>;
    getAuditTrail(limit: bigint): Promise<Array<AuditRecord>>;
    getAutoArchiveDays(): Promise<bigint>;
    getAvailableSlots(agentId: string, date: string): Promise<TimeSlot>;
    getAverageRating(): Promise<number>;
    getBlogPosts(): Promise<Array<BlogPost>>;
    getBotContext(): Promise<string>;
    getBotResponse(userMessage: string): Promise<string>;
    getBriefingByDate(date: string): Promise<DailyBriefing | null>;
    getBuilderByRera(reraNumber: string): Promise<BuilderProfile | null>;
    getBuilderProfiles(): Promise<Array<BuilderProfile>>;
    getBuilderTrust(builderId: string): Promise<BuilderTrustRecord | null>;
    getCallbackRequests(): Promise<Array<CallbackRequest>>;
    getCampaignById(campaignId: string): Promise<Campaign | null>;
    getCampaigns(): Promise<Array<Campaign>>;
    getChatAnalytics(): Promise<{
        totalChats: bigint;
        topTopics: Array<[string, bigint]>;
    }>;
    getClient(id: string): Promise<Client | null>;
    getClientById(clientId: string): Promise<Client__1 | null>;
    getClients(): Promise<Array<Client>>;
    getClientsByStage(stage: string): Promise<Array<Client>>;
    getCommissionInvoices(): Promise<Array<CommissionInvoice>>;
    getCommissions(): Promise<Array<CommissionRecord>>;
    getCommissionsByStaff(staffId: string): Promise<Array<CommissionRecord>>;
    getComplaint(refNumber: string): Promise<ComplaintTicket | null>;
    getCourse(courseId: string): Promise<{
        __kind__: "ok";
        ok: Course;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCrmAppointments(): Promise<Array<CrmAppointment>>;
    getCrmDashboardStats(): Promise<Array<DashboardStat>>;
    getCrmLeadsByStage(stage: string): Promise<Array<Lead__1>>;
    getCrmNotifications(): Promise<Array<AppNotification>>;
    getCsrImpact(): Promise<Array<CsrImpactEntry>>;
    getCurrentVisitors(): Promise<bigint>;
    getDashboardStats(): Promise<DashboardStats>;
    getDeal(dealId: string): Promise<{
        __kind__: "ok";
        ok: Deal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getDealCounter(): Promise<{
        desc: string;
        count: bigint;
        updatedAt: bigint;
    }>;
    getDealNotes(dealId: string): Promise<Array<DealNote>>;
    getDeals(): Promise<Array<Deal__1>>;
    getEnrollments(studentId: string): Promise<Array<Enrollment>>;
    getEventBookings(): Promise<Array<EventBooking>>;
    getEventById(eventId: string): Promise<Event_ | null>;
    getEvents(): Promise<Array<Event_>>;
    getFeedback(): Promise<Array<Feedback>>;
    getFinancialMetrics(): Promise<Array<FinancialMetric>>;
    getFormStats(): Promise<FormStats>;
    getInteractionCount(): Promise<bigint>;
    getInteractionStats(): Promise<{
        needsAttentionCount: bigint;
        total: bigint;
        avgMessageLength: bigint;
        todayCount: bigint;
    }>;
    getInteractions(offset: bigint, limit: bigint): Promise<Array<ChatInteraction>>;
    getInvoices(): Promise<Array<Invoice>>;
    getJantriRate(area: string): Promise<JantriRate | null>;
    /**
     * / Get KPI summary for the Master Control dashboard.
     */
    getKPIs(): Promise<{
        totalProperties: bigint;
        activeDeals: bigint;
        totalLeads: bigint;
        totalEnquiries: bigint;
        totalAuctions: bigint;
        totalStaff: bigint;
        activeSessions: bigint;
        securityEvents: bigint;
    }>;
    getLatestBriefing(): Promise<DailyBriefing | null>;
    getLatestMarketData(): Promise<Array<MarketDataPoint>>;
    getLead(id: string): Promise<Lead | null>;
    getLeadPipelineStats(): Promise<{
        new: bigint;
        closedWon: bigint;
        siteVisit: bigint;
        contacted: bigint;
        closedLost: bigint;
    }>;
    getLeadQualifications(): Promise<Array<LeadQualification>>;
    getLeadStats(): Promise<{
        total: bigint;
        hotLeads: bigint;
        warmLeads: bigint;
        coldLeads: bigint;
    }>;
    getLeads(): Promise<Array<Lead>>;
    getLeadsByStage(stage: string): Promise<Array<PropertyEnquiry>>;
    getLegalDoc(id: string): Promise<LegalDoc | null>;
    getListing(listingId: string): Promise<{
        __kind__: "ok";
        ok: ExchangeListing;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getLiveMarketData(): Promise<{
        interestRates: Array<InterestRateEntry>;
        lastUpdated: string;
        rbiNote: string;
        jantriUpdate: string;
    }>;
    getLocalityDemand(): Promise<Array<LocalityDemand>>;
    getLocalityDemandFor(locality: string): Promise<LocalityDemand | null>;
    getMarketDataByLocality(locality: string): Promise<Array<MarketDataPoint>>;
    getMarketReports(): Promise<Array<MarketReport>>;
    getMediaPost(postId: string): Promise<{
        __kind__: "ok";
        ok: MediaPost;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMoreInfoRequests(): Promise<Array<MoreInfoRequest>>;
    /**
     * / Get the morning briefing (latest daily summary + KPIs).
     */
    getMorningBriefing(): Promise<{
        totalProperties: bigint;
        activeDeals: bigint;
        date: string;
        greeting: string;
        totalLeads: bigint;
        summary: string;
        activeSessions: bigint;
        securityEventsToday: bigint;
        newEnquiriesToday: bigint;
    }>;
    getMusicArtists(): Promise<Array<MusicArtist>>;
    getNewEnquiryCount(): Promise<bigint>;
    getNotifications(): Promise<Array<Notification>>;
    getObserverAccessLogs(code: string): Promise<Array<ObserverAccessLog>>;
    getOverdueLeadReminders(): Promise<Array<LeadNurtureReminder>>;
    getPartnerApplications(): Promise<Array<PartnerApplication>>;
    getPriceHistory(propertyId: string): Promise<Array<PriceHistoryEntry>>;
    getProperties(): Promise<Array<Property>>;
    getPropertiesForAdmin(): Promise<Array<PropertyListing>>;
    getProperty(id: string): Promise<Property | null>;
    getPropertyAlerts(): Promise<Array<PropertyAlert>>;
    getPropertyById(id: string): Promise<PropertyListing | null>;
    getPropertyCount(): Promise<bigint>;
    getPropertyEnquiries(): Promise<Array<PropertyEnquiry>>;
    getPropertyEnquiriesByStatus(status: string): Promise<Array<PropertyEnquiry>>;
    getPropertyEnquiryCount(): Promise<bigint>;
    getPropertyIntelligence(propertyId: string): Promise<PropertyIntelligence | null>;
    getPropertyPerformance(): Promise<Array<PropertyPerformance>>;
    getPropertyViewCount(propertyId: string): Promise<bigint>;
    getProposals(): Promise<Array<Proposal>>;
    getPublishedBlogPosts(): Promise<Array<BlogPost>>;
    getPublishedMarketReports(): Promise<Array<MarketReport>>;
    getQuoteRequests(): Promise<Array<QuoteRequest>>;
    getRSVPsByEvent(eventId: bigint): Promise<Array<RSVP>>;
    getRealTimeStats(): Promise<{
        activeNow: bigint;
        totalAgents: bigint;
        avgAccuracy: number;
        lastUpdated: string;
        propertiesAdded: bigint;
        contentGenerated: bigint;
        leadsProcessed: bigint;
        tasksToday: bigint;
    }>;
    getRecentAgentActivities(limit: bigint): Promise<Array<AgentActivity>>;
    getRecentlyAddedProperties(n: bigint): Promise<Array<PropertyListing>>;
    getReferralByCode(code: string): Promise<Referral | null>;
    getResponseTimeBadge(): Promise<string>;
    getReviews(): Promise<Array<ReviewRecord>>;
    getRichSecurityEvents(limit: bigint): Promise<Array<RichSecurityEvent>>;
    getSatisfactionRatings(): Promise<Array<SatisfactionRating>>;
    getSecurityAuditLog(limit: bigint): Promise<Array<AuditEntry>>;
    getSecurityEvents(limit: bigint): Promise<Array<SecurityEvent>>;
    getSecurityHealthReport(activeSessionCount: bigint, suspendedAccountCount: bigint, pendingBiometricCount: bigint, failedLoginsLast24h: bigint, lockoutsLast24h: bigint): Promise<SecurityHealthReport>;
    getSecurityScore(): Promise<bigint>;
    getSecurityStats(): Promise<{
        totalEvents: bigint;
        criticalCount: bigint;
        resolvedCount: bigint;
        threatsBlocked: bigint;
    }>;
    getService(id: bigint): Promise<Service | null>;
    getServiceSubmissions(): Promise<Array<ServiceSubmission>>;
    getSiteVisits(): Promise<Array<SiteVisit>>;
    getSocietyReviews(societyName: string): Promise<Array<SocietyReview>>;
    getStaff(): Promise<Array<Staff>>;
    getStaffById(staffId: string): Promise<Staff | null>;
    getStaffMembers(): Promise<Array<AdminStaffMember>>;
    getSubmissionStats(): Promise<{
        total: bigint;
        unread: bigint;
        byService: Array<[string, bigint]>;
    }>;
    getSubmissionsByService(serviceCategory: string): Promise<Array<ServiceSubmission>>;
    getSupportForms(): Promise<Array<SupportForm>>;
    /**
     * / Get recent security threat events (last N events).
     */
    getThreatAlerts(limit: bigint): Promise<Array<SecurityEvent>>;
    getThreatIntel(limit: bigint): Promise<Array<ThreatIntelEntry>>;
    getTopViewedProperties(limit: bigint): Promise<Array<[string, bigint]>>;
    getTriggeredCanaries(): Promise<Array<CanaryToken>>;
    getTutorialCompletions(userId: string | null): Promise<Array<TutorialCompletion>>;
    getTutorialStats(): Promise<Array<{
        completions: bigint;
        skips: bigint;
        appKey: string;
    }>>;
    getTutorialSteps(appKey: string, mode: string): Promise<Array<TutorialStep>>;
    getTutorialStepsByApp(appId: string): Promise<Array<TutorialStep>>;
    getTutorialSuggestions(): Promise<Array<TutorialSuggestion>>;
    getUnreadNotificationCount(): Promise<bigint>;
    getVendor(vendorId: string): Promise<{
        __kind__: "ok";
        ok: Vendor;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getVisitRequests(): Promise<Array<VisitRequest>>;
    getVisitorCount(): Promise<bigint>;
    /**
     * / Get weekly business review summary.
     */
    getWeeklyReview(): Promise<{
        totalProperties: bigint;
        period: string;
        totalLeads: bigint;
        summary: string;
        totalEnquiries: bigint;
        totalStaff: bigint;
        securityEvents: bigint;
        closedDeals: bigint;
        newDeals: bigint;
    }>;
    incrementPostViews(postId: string): Promise<void>;
    incrementPropertyView(propertyId: string): Promise<void>;
    incrementPropertyViews(id: string): Promise<boolean>;
    incrementVisitorCount(): Promise<bigint>;
    invalidateAllSessions(staffId: string): Promise<boolean>;
    invalidateSession(sessionId: string): Promise<boolean>;
    isDeviceTrusted(staffId: string, deviceId: string): Promise<boolean>;
    isIpBlocked(ipAddress: string): Promise<boolean>;
    isLockdownActive(): Promise<boolean>;
    liftLockdown(adminPasswordHash: string): Promise<boolean>;
    listAiDecisions(limit: bigint): Promise<Array<AiDecision>>;
    listAllCampaigns(): Promise<Array<Campaign>>;
    listAllClients(): Promise<Array<Client__1>>;
    listAllEvents(): Promise<Array<Event_>>;
    listAllObserverAccessLogs(limit: bigint): Promise<Array<ObserverAccessLog>>;
    listAuctions(): Promise<Array<Auction>>;
    listBookings(): Promise<Array<Booking>>;
    listBriefings(limit: bigint): Promise<Array<DailyBriefing>>;
    listBuilderTrust(): Promise<Array<BuilderTrustRecord>>;
    listCanaryTokens(): Promise<Array<CanaryToken>>;
    listCommissions(): Promise<Array<CommissionRecord>>;
    listCourses(): Promise<Array<Course>>;
    listDeals(): Promise<Array<Deal>>;
    listDevices(staffId: string): Promise<Array<DeviceRecord>>;
    listExchangeListings(): Promise<Array<ExchangeListing>>;
    listJantriRates(): Promise<Array<JantriRate>>;
    listLegalDocs(): Promise<Array<LegalDoc>>;
    listMediaPosts(): Promise<Array<MediaPost>>;
    listObserverCodeInfos(adminToken: string): Promise<Array<ObserverCodeInfo>>;
    listObserverCodes(): Promise<Array<ObserverCodeRecord>>;
    listPropertyIntelligence(): Promise<Array<PropertyIntelligence>>;
    listStaff(): Promise<Array<Staff>>;
    listVendors(): Promise<Array<Vendor>>;
    logAIActivity(agentId: string, actionType: string, count: bigint, result: string): Promise<void>;
    logAIAgentAction(id: string, action: string): Promise<boolean>;
    logAction(staffId: string, action: string, target: string, details: string, ipAddress: string, deviceId: string): Promise<bigint>;
    logAgentActivity(agentId: string, agentName: string, cluster: string, action: string, status: string, result: string): Promise<void>;
    logAiDecision(decisionType: AiDecisionType, description: string, actionTaken: string, confidenceScore: bigint, agentName: string, reversible: boolean, outcome: string): Promise<{
        __kind__: "ok";
        ok: AiDecision;
    } | {
        __kind__: "err";
        err: string;
    }>;
    logAuditEvent(actorId: string, action: string, target: string, details: string, ip: string, result: string): Promise<string>;
    logCallbackRequest(name: string, phone: string, service: string, pageName: string): Promise<string>;
    logChatInteraction(sessionId: string, userMessage: string, botResponse: string): Promise<bigint>;
    logChatTopic(topic: string): Promise<boolean>;
    logFeedback(rating: bigint, comment: string, pageName: string): Promise<string>;
    logLeadQualification(sessionId: string, budget: string, location: string, propertyType: string, leadScore: string): Promise<string>;
    logMoreInfoRequest(name: string, email: string, service: string, question: string, pageName: string): Promise<string>;
    logObserverAccess(code: string, sessionId: string, scope: string): Promise<string>;
    logQuoteRequest(name: string, phone: string, email: string, service: string, message: string, pageName: string): Promise<string>;
    logReferralClick(code: string): Promise<void>;
    logReferralEnquiry(code: string, enquiryId: string): Promise<void>;
    logSecurityEvent(eventType: SecurityEventType, staffId: string, ipAddress: string, deviceId: string, details: string): Promise<bigint>;
    logServiceSubmission(serviceCategory: string, innerPage: string, formType: string, fields: Array<[string, string]>, submitterName: string, submitterPhone: string, submitterEmail: string, indemnityAccepted: boolean): Promise<bigint>;
    logSupportForm(name: string, phone: string, email: string, service: string, message: string): Promise<string>;
    /**
     * / Authenticate with username + password. Returns session token, role, and message.
     */
    login(id: string, password: string): Promise<{
        ok: boolean;
        role: string;
        message: string;
        sessionId: string;
    }>;
    /**
     * / Invalidate a session by token (logout).
     */
    logout(token: string): Promise<void>;
    markAllCrmNotificationsRead(): Promise<bigint>;
    markAllNotificationsRead(): Promise<void>;
    markCallbackRead(id: string, isRead: boolean): Promise<boolean>;
    markCommissionPaid(commissionId: string): Promise<boolean>;
    markCommissionPaidResult(commissionId: string): Promise<{
        __kind__: "ok";
        ok: CommissionRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markCrmNotificationRead(id: bigint): Promise<boolean>;
    markEnquiryContacted(id: string): Promise<boolean>;
    markFeedbackRead(id: string, isRead: boolean): Promise<boolean>;
    markMoreInfoRead(id: string, isRead: boolean): Promise<boolean>;
    markNotificationRead(targetId: string): Promise<boolean>;
    markQuoteRead(id: string, isRead: boolean): Promise<boolean>;
    markSubmissionRead(id: bigint, isRead: boolean): Promise<boolean>;
    markSupportRead(id: string, isRead: boolean): Promise<boolean>;
    placeBid(auctionId: string, bidderId: string, amount: number): Promise<{
        __kind__: "ok";
        ok: Bid;
    } | {
        __kind__: "err";
        err: string;
    }>;
    plantCanaryToken(tokenLabel: string, tokenValue: string): Promise<{
        __kind__: "ok";
        ok: CanaryToken;
    } | {
        __kind__: "err";
        err: string;
    }>;
    publishBlogPost(targetId: string, isPublished: boolean): Promise<boolean>;
    publishMarketReport(targetId: string, isPublished: boolean): Promise<boolean>;
    publishMediaPost(postId: string): Promise<{
        __kind__: "ok";
        ok: MediaPost;
    } | {
        __kind__: "err";
        err: string;
    }>;
    rateVendor(vendorId: string, rating: number): Promise<{
        __kind__: "ok";
        ok: Vendor;
    } | {
        __kind__: "err";
        err: string;
    }>;
    recordLocalityEnquiry(locality: string): Promise<void>;
    recordLocalityView(locality: string): Promise<void>;
    recordPriceHistory(propertyId: string, price: bigint, recordedBy: string, note: string): Promise<{
        __kind__: "ok";
        ok: PriceHistoryEntry;
    } | {
        __kind__: "err";
        err: string;
    }>;
    recordPropertyEnquiry(id: string): Promise<boolean>;
    recordSecurityEvent(eventType: string, severity: string, description: string, ip: string, aiTierId: string): Promise<string>;
    recordTutorialCompletion(userId: string, appKey: string, mode: string, skipped: boolean): Promise<void>;
    registerDevice(staffId: string, deviceId: string, userAgent: string, ipAddress: string): Promise<{
        __kind__: "ok";
        ok: DeviceRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    registerForEvent(id: string): Promise<boolean>;
    rejectTutorialSuggestion(id: bigint): Promise<boolean>;
    removeActiveVisitor(visitorId: string): Promise<void>;
    removeStaff(staffId: string): Promise<boolean>;
    reorderTutorialSteps(appKey: string, mode: string, orderedIds: Array<bigint>): Promise<boolean>;
    resetFailedAttempts(staffId: string): Promise<boolean>;
    resetTutorialCompletion(userId: string, appKey: string): Promise<boolean>;
    resolveSecurityEvent(id: string): Promise<boolean>;
    respondToReview(id: bigint, responseText: string): Promise<boolean>;
    revokeBiometric(staffId: string): Promise<boolean>;
    revokeDevice(staffId: string, deviceId: string): Promise<{
        __kind__: "ok";
        ok: DeviceRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    revokeObserverCode(code: string): Promise<boolean>;
    revokeObserverCodeInfo(code: string, adminToken: string): Promise<boolean>;
    rollbackAiDecision(decisionId: string, reason: string): Promise<{
        __kind__: "ok";
        ok: AiDecision;
    } | {
        __kind__: "err";
        err: string;
    }>;
    searchClients(searchQuery: string): Promise<Array<Client>>;
    searchInteractions(queryText: string, offset: bigint, limit: bigint): Promise<Array<ChatInteraction>>;
    searchLeads(searchQuery: string): Promise<Array<Lead>>;
    searchProperties(searchQuery: string): Promise<Array<Property>>;
    sendOtp(staffId: string): Promise<boolean>;
    setAutoArchiveDays(days: bigint): Promise<boolean>;
    setMobileNumber(staffId: string, mobileNumber: string): Promise<boolean>;
    setResponseTimeBadge(text: string): Promise<boolean>;
    staffLogin(loginId: string, password: string): Promise<{
        id: string;
        accessLevel: string;
        name: string;
        role: string;
        accessSections: Array<string>;
    } | null>;
    /**
     * / Submit a callback request form.
     */
    submitCallbackRequest(name: string, phone: string, service: string, pageName: string): Promise<string>;
    submitComplaint(name: string, phone: string, service: string, issue: string): Promise<string>;
    /**
     * / Submit a contact / general enquiry form.
     */
    submitContactForm(name: string, phone: string, email: string, subject: string, message: string): Promise<string>;
    submitEnquiry(listingId: string, buyerId: string, message: string, offerPrice: number | null): Promise<{
        __kind__: "ok";
        ok: ExchangeEnquiry;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitLeadQualification(sessionId: string, answers: {
        propertyType: string;
        name: string;
        phone: string;
        budget: string;
        location: string;
    }): Promise<string>;
    submitPropertyAlert(name: string, phone: string, email: string, propertyType: string, action: string, location: string, maxBudget: bigint, bhk: string): Promise<string>;
    submitPropertyEnquiry(propertyId: string, customerName: string, customerPhone: string, customerEmail: string, customerMessage: string, preferredTime: string, visitDate: string): Promise<string>;
    /**
     * / Submit a quote request form.
     */
    submitQuoteRequest(name: string, phone: string, email: string, service: string, message: string, pageName: string): Promise<string>;
    submitSatisfactionRating(enquiryId: string, rating: bigint, feedback: string): Promise<boolean>;
    /**
     * / Submit a service-specific form (routes to the service submission log).
     */
    submitServiceForm(serviceCategory: string, innerPage: string, formType: string, fields: Array<[string, string]>, submitterName: string, submitterPhone: string, submitterEmail: string, indemnityAccepted: boolean): Promise<string>;
    submitSocietyReview(societyName: string, reviewerAlias: string, rating: bigint, maintenance: bigint, security: bigint, amenities: bigint, management: bigint, review: string): Promise<boolean>;
    submitVisitRequest(propertyId: string, propertyTitle: string, customerName: string, customerPhone: string, customerEmail: string, preferredDate: string, preferredTime: string, visitType: string): Promise<string>;
    suspendStaff(staffId: string): Promise<boolean>;
    terminateSession(token: string): Promise<boolean>;
    toggleAnnouncement(id: string, isActive: boolean): Promise<boolean>;
    triggerCanary(tokenValue: string, triggeredBy: string): Promise<{
        __kind__: "ok";
        ok: CanaryToken;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateAIAgentFullConfig(id: string, config: string): Promise<boolean>;
    updateAIAgentStatus(id: string, isActive: boolean): Promise<boolean>;
    updateAIInsightStatus(id: string, status: string): Promise<boolean>;
    updateAISystemConfig(config: AISystemConfig): Promise<boolean>;
    updateAppointmentStatus(targetId: string, status: string): Promise<boolean>;
    updateBookingStatus(bookingId: string, status: string): Promise<{
        __kind__: "ok";
        ok: Booking;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateClient(id: string, name: string, phone: string, email: string, notes: string): Promise<boolean>;
    updateCommissionInvoiceStatus(id: bigint, status: string): Promise<boolean>;
    updateComplaintStatus(id: string, status: string, notes: string): Promise<boolean>;
    updateCrmLeadStage(id: bigint, stage: string, score: string): Promise<boolean>;
    updateCsrEntry(adminToken: string, id: string, value: bigint, description: string): Promise<boolean>;
    updateDealStage(dealId: string, stage: string): Promise<{
        __kind__: "ok";
        ok: Deal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateDocStatus(id: string, newStatus: string): Promise<boolean>;
    updateEnquiryStatus(id: string, status: string, notes: string): Promise<boolean>;
    updateEventBookingStatus(adminToken: string, id: string, status: string): Promise<boolean>;
    updateInvoiceStatus(targetId: string, status: string): Promise<boolean>;
    updateLead(id: string, status: string, score: bigint, assignedTo: string, notes: string): Promise<boolean>;
    updateLeadLastContacted(leadId: string): Promise<boolean>;
    updateLeadScore(id: string, score: bigint): Promise<boolean>;
    updateLeadStage(id: string, stage: string): Promise<boolean>;
    updateListingStatus(listingId: string, status: string): Promise<{
        __kind__: "ok";
        ok: ExchangeListing;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateMarketDataCache(): Promise<boolean>;
    updateMusicArtist(adminToken: string, id: string, available: boolean, bio: string): Promise<boolean>;
    updatePartnerStatus(targetId: string, status: string, notes: string): Promise<boolean>;
    updateProgress(courseId: string, studentId: string, lessonId: string): Promise<{
        __kind__: "ok";
        ok: Enrollment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateProperty(id: string, title: string, status: string, description: string): Promise<boolean>;
    updateSiteVisitStatus(targetId: string, status: string): Promise<boolean>;
    updateStaff(staffId: string, name: string, email: string, role: StaffRole): Promise<boolean>;
    updateStaffMobile(staffId: string, mobileNumber: string): Promise<boolean>;
    updateStaffRole(staffId: string, role: StaffRole): Promise<boolean>;
    updateStaffStatus(staffId: string, status: string): Promise<boolean>;
    updateTutorialStepDesc(id: string, description: string): Promise<boolean>;
    updateVendorJobStatus(jobId: string, status: string): Promise<{
        __kind__: "ok";
        ok: VendorJob;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateVisitRequestStatus(id: string, status: string): Promise<boolean>;
    upsertBuilderTrust(builderId: string, builderName: string, reraFilingCount: bigint, complaintCount: bigint, deliveryScore: bigint): Promise<{
        __kind__: "ok";
        ok: BuilderTrustRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    upsertJantriRate(area: string, ratePerSqFt: bigint, effectiveFrom: string): Promise<{
        __kind__: "ok";
        ok: JantriRate;
    } | {
        __kind__: "err";
        err: string;
    }>;
    upsertPropertyIntelligence(propertyId: string, reraNumber: string, builderId: string, amenities: Array<string>, investmentGrade: InvestmentGrade, negotiationMin: bigint, negotiationMax: bigint, builderTrustScore: bigint, latitude: number, longitude: number): Promise<{
        __kind__: "ok";
        ok: PropertyIntelligence;
    } | {
        __kind__: "err";
        err: string;
    }>;
    upsertTutorialStep(step: TutorialStep): Promise<bigint>;
    validateObserverCode(code: string): Promise<boolean>;
    validateObserverCodeInfo(code: string, visitorInfo: string): Promise<boolean>;
    validateOtp(staffId: string, code: string): Promise<boolean>;
    validateSession(sessionId: string, deviceId: string): Promise<boolean>;
    validateSessionToken(token: string): Promise<Staff | null>;
    /**
     * / Verify a mobile OTP for the given staffId. Returns session token on success.
     */
    verifyOTP(phone: string, code: string): Promise<{
        ok: boolean;
        role: string;
        message: string;
        sessionId: string;
    }>;
    verifyOtp(staffId: string, code: string, deviceId: string, ipAddress: string, userAgent: string): Promise<{
        ok: boolean;
        role: string;
        message: string;
        sessionId: string;
    }>;
}
