// export interface ContributionDay {
//   date: string;
//   count: number;
//   level: 0 | 1 | 2 | 3 | 4;
// }

// export interface GitHubActivityData {
//   username: string;
//   followers: number;
//   publicRepos: number;
//   totalStars: number;
//   totalContributions: number;
//   days: ContributionDay[];
// }

// const LEVEL_MAP: Record<string, 0 | 1 | 2 | 3 | 4> = {
//   NONE: 0,
//   FIRST_QUARTILE: 1,
//   SECOND_QUARTILE: 2,
//   THIRD_QUARTILE: 3,
//   FOURTH_QUARTILE: 4,
// };

// export async function getGitHubActivityData(
//   username: string,
//   daysLimit = 98, // 14 columns x 7 rows = 98 days (14 weeks)
// ): Promise<GitHubActivityData> {
//   const token = process.env.GITHUB_TOKEN;
//   const headers: HeadersInit = {
//     Accept: "application/vnd.github+json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };

//   // 1. User profile (followers & public_repos)
//   const userRes = await fetch(`https://api.github.com/users/${username}`, {
//     headers,
//     next: { revalidate: 3600 },
//   });
//   if (!userRes.ok) {
//     throw new Error(`Failed to fetch GitHub user "${username}"`);
//   }
//   const user = await userRes.json();

//   // 2. Paginate repos to calculate total stars
//   let page = 1;
//   let totalStars = 0;
//   while (true) {
//     const reposRes = await fetch(
//       `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&type=owner`,
//       { headers, next: { revalidate: 3600 } },
//     );
//     if (!reposRes.ok) break;

//     const repos: Array<{ stargazers_count: number; fork: boolean }> =
//       await reposRes.json();
//     if (repos.length === 0) break;

//     for (const repo of repos) {
//       if (!repo.fork) {
//         totalStars += repo.stargazers_count;
//       }
//     }

//     if (repos.length < 100) break;
//     page += 1;
//   }

//   // 3. Contribution calendar via GitHub GraphQL API
//   let totalContributions = 0;
//   let allDays: ContributionDay[] = [];

//   if (token) {
//     const query = `
//       query($login: String!) {
//         user(login: $login) {
//           contributionsCollection {
//             contributionCalendar {
//               totalContributions
//               weeks {
//                 contributionDays {
//                   date
//                   contributionCount
//                   contributionLevel
//                 }
//               }
//             }
//           }
//         }
//       }
//     `;

//     const gqlRes = await fetch("https://api.github.com/graphql", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ query, variables: { login: username } }),
//       next: { revalidate: 3600 },
//     });

//     if (gqlRes.ok) {
//       const gqlJson = await gqlRes.json();
//       const cal =
//         gqlJson?.data?.user?.contributionsCollection?.contributionCalendar;
//       if (cal) {
//         totalContributions = cal.totalContributions;
//         allDays = cal.weeks.flatMap(
//           (w: {
//             contributionDays: Array<{
//               date: string;
//               contributionCount: number;
//               contributionLevel: string;
//             }>;
//           }) =>
//             w.contributionDays.map((d) => ({
//               date: d.date,
//               count: d.contributionCount,
//               level: LEVEL_MAP[d.contributionLevel] ?? 0,
//             })),
//         );
//       }
//     }
//   }

//   // Keep the most recent `daysLimit` days (default 98 = 14 columns x 7 rows)
//   const days = allDays.slice(-daysLimit);

//   return {
//     username,
//     followers: user.followers ?? 0,
//     publicRepos: user.public_repos ?? 0,
//     totalStars,
//     totalContributions,
//     days,
//   };
// }
import { cacheLife } from "next/cache";

export interface GitHubStatsData {
  username: string;
  publicRepos: number;
  totalStars: number;
  totalContributions: number;
  dailyCounts: number[];
  endDate: string;
}

export async function getGitHubStats(username: string): Promise<GitHubStatsData> {
  "use cache";
  cacheLife("hours");

  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // 1. User profile (public_repos)
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers,
  });
  if (!userRes.ok) {
    throw new Error(`Failed to fetch GitHub user "${username}"`);
  }
  const user = await userRes.json();

  // 2. Paginate repos to calculate total stars
  let page = 1;
  let totalStars = 0;
  while (true) {
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&type=owner`,
      { headers },
    );
    if (!reposRes.ok) break;

    const repos: Array<{ stargazers_count: number; fork: boolean }> =
      await reposRes.json();
    if (repos.length === 0) break;

    for (const repo of repos) {
      if (!repo.fork) {
        totalStars += repo.stargazers_count;
      }
    }

    if (repos.length < 100) break;
    page += 1;
  }

  // 3. Daily contribution counts via GitHub GraphQL API
  let totalContributions = 0;
  let dailyCounts: number[] = [];
  const todayStr = new Date().toISOString().slice(0, 10);
  let endDate = todayStr;

  if (token) {
    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const gqlRes = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    if (gqlRes.ok) {
      const gqlJson = await gqlRes.json();
      const cal =
        gqlJson?.data?.user?.contributionsCollection?.contributionCalendar;
      if (cal) {
        totalContributions = cal.totalContributions;
        const flatDays: Array<{ date: string; contributionCount: number }> =
          cal.weeks.flatMap(
            (w: {
              contributionDays: Array<{
                date: string;
                contributionCount: number;
              }>;
            }) => w.contributionDays,
          );
        const upToToday = flatDays.filter((d) => d.date <= todayStr);
        const series = upToToday.length > 0 ? upToToday : flatDays;
        dailyCounts = series.map((d) => d.contributionCount);
        if (series.length > 0) {
          endDate = series[series.length - 1]!.date;
        }
      }
    }
  }

  return {
    username,
    publicRepos: user.public_repos ?? 0,
    totalStars,
    totalContributions,
    dailyCounts,
    endDate,
  };
}