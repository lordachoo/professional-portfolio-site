import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Navigation items
export const navigationItems = pgTable("navigation_items", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
});

// Site content sections (hero, about, contact, etc.)
export const contentSections = pgTable("content_sections", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(), // 'hero', 'about', 'contact'
  title: text("title"),
  subtitle: text("subtitle"),
  content: text("content"),
  metadata: jsonb("metadata"), // Additional fields like images, links, etc.
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  readTime: integer("read_time"), // in minutes
  views: integer("views").default(0),
});

// Resume experience entries
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  startDate: text("start_date").notNull(), // YYYY-MM format
  endDate: text("end_date"), // null for current position
  description: text("description"),
  achievements: text("achievements").array(),
  technologies: text("technologies").array(),
  order: integer("order").notNull().default(0),
});

// Education entries
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  location: text("location"),
  startYear: text("start_year").notNull(),
  endYear: text("end_year"),
  description: text("description"),
  gpa: text("gpa"),
  order: integer("order").notNull().default(0),
});

// Skills categories and individual skills
export const skillCategories = pgTable("skill_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  order: integer("order").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => skillCategories.id),
  name: text("name").notNull(),
  level: integer("level").notNull(), // 1-100
  order: integer("order").notNull().default(0),
});

// Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies").array(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  language: text("language"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  order: integer("order").notNull().default(0),
});

// Admin users table for simple authentication
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  salt: varchar("salt", { length: 32 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

// Admin sessions table
export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: integer("user_id").references(() => adminUsers.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User profile/settings
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  socialLinks: jsonb("social_links"), // {github, linkedin, twitter, etc.}
  themePreference: text("theme_preference").default("dark"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const skillCategoriesRelations = relations(skillCategories, ({ many }) => ({
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
}));

// Insert schemas
export const insertNavigationItemSchema = createInsertSchema(navigationItems).omit({
  id: true,
});

export const insertContentSectionSchema = createInsertSchema(contentSections).omit({
  id: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
});

export const insertSkillCategorySchema = createInsertSchema(skillCategories).omit({
  id: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProfileSchema = createInsertSchema(profile).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;

export type NavigationItem = typeof navigationItems.$inferSelect;
export type InsertNavigationItem = z.infer<typeof insertNavigationItemSchema>;

export type ContentSection = typeof contentSections.$inferSelect;
export type InsertContentSection = z.infer<typeof insertContentSectionSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;

export type SkillCategory = typeof skillCategories.$inferSelect;
export type InsertSkillCategory = z.infer<typeof insertSkillCategorySchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Profile = typeof profile.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
