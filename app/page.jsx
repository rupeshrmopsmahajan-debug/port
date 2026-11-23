import { HeroSection } from "@/components/HeroSection";
import { SiteFooter } from "@/components/SiteFooter";

// import { BlurAccordion } from "@/components/BlurAccordion";
// import { CompaniesWorkedWith } from "@/components/CompaniesWorkedWith";
// import { DailyQuoteSection } from "@/components/DailyQuoteSection";
// import { DottedUnderline } from "@/components/DottedUnderline";
// import { FocusAreas } from "@/components/FocusAreas";
// import { GitHubActivityGrid } from "@/components/GitHubActivityCard";
// import { ProjectIndex } from "@/components/ProjectSection";
// import { SiteNavigation } from "@/components/SiteNavigation";
// import { WritingList } from "@/components/WritingList";
// import { getGitHubStats } from "@/lib/github";

export default async function Home() {
  // const username = process.env.GITHUB_USERNAME || "octocat";
  // const github = await getGitHubStats(username);

  return (
    <>
      {/* <HeroSection /> */}
      {/* <DailyQuoteSection/>
      <DottedUnderline />
      <ProjectIndex />
      <BlurAccordion />
      <FocusAreas />
      <WritingList />
      <CompaniesWorkedWith />
      <GitHubActivityGrid
        username={github.username}
        repos={github.publicRepos}
        stars={github.totalStars}
        data={github.dailyCounts}
        endDate={new Date(`${github.endDate}T00:00:00`)}
        unit="contribution"
        palette="green"
      /> */}
      <SiteFooter />
    </>
  );
}
