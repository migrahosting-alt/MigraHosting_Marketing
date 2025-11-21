# COPILOT BRIEF – VPS & CLOUD PAGE (MigraVPS / MigraCloud)

## Goal
Create a page that sells both:
- **MigraVPS** (fixed-size virtual servers)
- **MigraCloud** (flexible, auto-scaling cloud instances)

## Key Ideas
- NVMe-powered Proxmox KVM nodes
- Root/sudo access (full control)
- Dedicated resources vs shared hosting
- Backups using Proxmox snapshots + external backups
- Pricing slightly under DigitalOcean/Linode/Vultr

## Page Structure

### 1. Hero
**Headline**: "Your own server, without the data center headache."
**Subheadline**: "Spin up NVMe-powered VPS or Cloud instances. Managed through mPanel."
**CTAs**: "Choose VPS Plan" / "Explore Cloud"

### 2. Pricing Section
Component: `<VpsCloudPricingSection />`
- Tabs: VPS (fixed) vs Cloud (auto-scaling)
- VPS: Small, Medium, Large, XLarge
- Cloud: Starter, Business

### 3. VPS vs Cloud Section
**VPS (Fixed Size)**:
- Predictable resources (CPU, RAM, storage)
- Great for production sites, databases, mail servers
- Fixed monthly pricing

**Cloud (Auto-Scaling)**:
- Burstable CPU/RAM
- Better for APIs, microservices, dynamic workloads
- Pay-as-you-go or monthly cap

### 4. Backups & Reliability Block
- Proxmox snapshots (daily, 3-30 day retention)
- External backups to srv1/srv2 + Windows backup server
- 99.9%+ uptime SLA
- Multi-datacenter redundancy (future)

### 5. FAQ
**Q: Can you manage the server for me?**
A: Yes! We offer optional managed services (patching, monitoring, firewall management). Contact sales for pricing.

**Q: Can I host multiple sites on one VPS?**
A: Absolutely. With root access, you can install cPanel, Plesk, or your own stack.

**Q: Do I get root access?**
A: Yes. Full root/sudo access on all VPS and Cloud plans.

**Q: Can I upgrade later without downtime?**
A: Yes. We can resize VPS/Cloud instances with minimal downtime (typically <5 minutes).

## Tone
- Slightly more technical (targeting devs and serious site owners)
- Emphasize we understand servers and will help them stay stable
- Not ultra-cheap, but honest and reliable

## Competitor Context
**vs DigitalOcean**: More predictable pricing (no surprise bandwidth charges), better support
**vs Linode**: Simpler pricing, mPanel integration, managed options
**vs Vultr**: Better support, Proxmox-based (more reliable), integrated backups

---
**Last Updated**: November 16, 2025
