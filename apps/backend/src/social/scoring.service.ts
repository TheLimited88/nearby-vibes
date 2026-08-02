import { Injectable, Logger } from '@nestjs/common';

interface PostScore {
  post_id: string;
  title: string;
  score: number;
  components: {
    view_score: number;
    click_score: number;
    redemption_score: number;
    like_score: number;
    comment_score: number;
    recency_score: number;
  };
}

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  // Calculate post score based on engagement metrics
  calculatePostScore(post: any, likes: number, comments: number): PostScore {
    const now = new Date().getTime();
    const postAge = now - new Date(post.published_at || post.created_at).getTime();
    const daysSincePublish = postAge / (1000 * 60 * 60 * 24);

    // View score (0-30 points)
    const viewScore = Math.min(post.view_count * 0.5, 30);

    // Click score (0-25 points)
    const clickScore = Math.min(post.click_count * 2, 25);

    // Redemption score (0-20 points)
    const redemptionScore = Math.min(post.redeem_count * 5, 20);

    // Like score (0-15 points)
    const likeScore = Math.min(likes * 1.5, 15);

    // Comment score (0-10 points)
    const commentScore = Math.min(comments * 2, 10);

    // Recency score (0-20 points) - newer posts score higher
    // Decay over 30 days
    const recencyDecay = Math.max(1 - daysSincePublish / 30, 0.1);
    const recencyScore = 20 * recencyDecay;

    const totalScore =
      viewScore +
      clickScore +
      redemptionScore +
      likeScore +
      commentScore +
      recencyScore;

    return {
      post_id: post.id,
      title: post.title,
      score: Math.round(totalScore * 100) / 100,
      components: {
        view_score: Math.round(viewScore * 100) / 100,
        click_score: Math.round(clickScore * 100) / 100,
        redemption_score: Math.round(redemptionScore * 100) / 100,
        like_score: Math.round(likeScore * 100) / 100,
        comment_score: Math.round(commentScore * 100) / 100,
        recency_score: Math.round(recencyScore * 100) / 100,
      },
    };
  }

  // Rank posts by engagement score
  rankPosts(posts: any[]): PostScore[] {
    return posts
      .map((post) =>
        this.calculatePostScore(
          post,
          post.likes_count || 0,
          post.comments_count || 0,
        ),
      )
      .sort((a, b) => b.score - a.score);
  }

  // Get trending posts (high engagement in recent period)
  getTrendingScore(post: any, timeWindowDays: number = 7): number {
    const now = new Date().getTime();
    const postAge = now - new Date(post.published_at || post.created_at).getTime();
    const daysSincePublish = postAge / (1000 * 60 * 60 * 24);

    // Only consider posts within the time window
    if (daysSincePublish > timeWindowDays) {
      return 0;
    }

    // Weight recent engagement more heavily
    const timeWeight = 1 - daysSincePublish / timeWindowDays;

    const engagementScore =
      post.view_count * 0.1 +
      post.click_count * 0.3 +
      post.redeem_count * 0.6;

    return engagementScore * timeWeight;
  }

  // Quality score based on conversion rate
  getQualityScore(post: any): number {
    if (post.view_count === 0) return 0;

    const conversionRate = post.redeem_count / post.view_count;
    const qualityScore = conversionRate * 100; // Convert to percentage

    return Math.min(qualityScore, 100); // Cap at 100
  }

  // Engagement rate (clicks / views)
  getEngagementRate(post: any): number {
    if (post.view_count === 0) return 0;
    return (post.click_count / post.view_count) * 100;
  }
}
