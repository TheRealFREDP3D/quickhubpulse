# GitHub Stats Dashboard - Design Brainstorm

## Design Approach Selected: Modern Minimalist with Developer Focus

### Design Philosophy

A clean, focused interface that prioritizes quick repository scanning and detailed insights. The design emphasizes clarity and data hierarchy while maintaining a professional developer aesthetic.

### Core Principles

1. **Information Hierarchy**: Most important metrics (views, stars, forks) are immediately visible on cards
2. **Rapid Scanning**: Grid layout allows quick visual comparison across repositories
3. **Progressive Disclosure**: Details appear in modal, keeping main view uncluttered
4. **Developer-First**: Uses familiar GitHub colors and patterns

### Color Philosophy

- **Primary**: GitHub-inspired blue (#0969da) for interactive elements and highlights
- **Neutral Base**: Clean whites and light grays for maximum readability
- **Accent**: Subtle green (#1a7f37) for positive metrics (stars, activity)
- **Muted**: Gray tones for secondary information
- **Reasoning**: Familiar to GitHub users, professional appearance, excellent contrast for accessibility

### Layout Paradigm

- **Card Grid**: Responsive 1-3 column layout (mobile → tablet → desktop)
- **Asymmetric Spacing**: Larger gaps between card groups, tighter internal spacing
- **Modal Detail View**: Full-screen overlay with smooth animation from card position
- **Sticky Header**: Token input and search remain accessible while scrolling

### Signature Elements

1. **Repository Cards**: Compact cards with OpenGraph image, key metrics, language badge
2. **Metric Badges**: Color-coded indicators (blue for views, green for stars, purple for activity)
3. **Traffic Chart**: 14-day trend visualization in modal detail view
4. **Smooth Transitions**: Card-to-modal animation using Framer Motion's layoutId

### Interaction Philosophy

- **Hover States**: Subtle lift and shadow on card hover to indicate interactivity
- **Click Feedback**: Immediate modal expansion with smooth animation
- **Keyboard Navigation**: Escape key closes modal, Tab cycles through cards
- **Loading States**: Skeleton cards during data fetch, smooth fade-in on completion

### Animation Guidelines

- **Card Entrance**: Staggered fade-in with slight upward motion (300ms)
- **Hover Effect**: Subtle scale (1.02) and shadow increase on hover
- **Modal Transition**: Smooth expansion from card position using shared layoutId
- **Chart Animation**: Gradual line drawing on modal open (500ms)
- **Micro-interactions**: 200ms transitions for all state changes

### Typography System

- **Display Font**: System stack (SF Pro Display, Segoe UI) for headings - clean and modern
- **Body Font**: System stack for body text - ensures consistent rendering across platforms
- **Font Weights**:
  - 700 (Bold) for repository names and key metrics
  - 600 (Semibold) for section headers
  - 500 (Medium) for secondary information
  - 400 (Regular) for descriptions and body text
- **Size Hierarchy**:
  - 32px: Main dashboard title
  - 20px: Repository name on cards
  - 16px: Card descriptions and metrics
  - 14px: Secondary labels
  - 12px: Helper text and badges

### Visual Refinements

- **Border Radius**: 8px for cards, 4px for badges (consistent with modern design)
- **Shadows**: Subtle elevation shadows on cards, increased on hover
- **Spacing Scale**: 4px base unit (4, 8, 12, 16, 24, 32px)
- **Grid Gaps**: 24px between cards for breathing room
