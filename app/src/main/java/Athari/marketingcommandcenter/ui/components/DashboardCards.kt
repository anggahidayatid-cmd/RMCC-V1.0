package Athari.marketingcommandcenter.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowDownward
import androidx.compose.material.icons.rounded.ArrowUpward
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Info
import androidx.compose.material.icons.rounded.Lightbulb
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material.icons.rounded.Warning
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DividerDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.data.model.ChannelPerformance
import Athari.marketingcommandcenter.data.model.InsightType
import Athari.marketingcommandcenter.data.model.ManagementInsight
import Athari.marketingcommandcenter.ui.theme.BorderColor
import Athari.marketingcommandcenter.ui.theme.DangerRed
import Athari.marketingcommandcenter.ui.theme.DangerRedContainer
import Athari.marketingcommandcenter.ui.theme.InfoBlue
import Athari.marketingcommandcenter.ui.theme.InfoBlueContainer
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryText
import Athari.marketingcommandcenter.ui.theme.SuccessGreen
import Athari.marketingcommandcenter.ui.theme.SuccessGreenContainer
import Athari.marketingcommandcenter.ui.theme.WarningOrange
import Athari.marketingcommandcenter.ui.theme.WarningOrangeContainer
import java.text.NumberFormat
import java.util.Locale

fun Double.toRupiah(): String {
    val formatter = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("id-ID"))
    formatter.maximumFractionDigits = 0
    return formatter.format(this).replace("Rp", "Rp ").replace(",00", "")
}

@Composable
fun KpiCard(
    title: String,
    value: String,
    icon: ImageVector,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    trendText: String? = null,
    isPositiveTrend: Boolean = true,
    accentColor: Color = PrimaryPurple
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.labelMedium,
                    color = SecondaryText,
                    fontWeight = FontWeight.Medium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )

                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(accentColor.copy(alpha = 0.12f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = title,
                        tint = accentColor,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = value,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            if (subtitle != null || trendText != null) {
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (trendText != null) {
                        val trendBg = if (isPositiveTrend) SuccessGreenContainer else DangerRedContainer
                        val trendColor = if (isPositiveTrend) SuccessGreen else DangerRed
                        val trendIcon = if (isPositiveTrend) Icons.Rounded.ArrowUpward else Icons.Rounded.ArrowDownward

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = trendBg,
                            modifier = Modifier.padding(end = 6.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = trendIcon,
                                    contentDescription = null,
                                    tint = trendColor,
                                    modifier = Modifier.size(12.dp)
                                )
                                Spacer(modifier = Modifier.width(2.dp))
                                Text(
                                    text = trendText,
                                    style = MaterialTheme.typography.labelSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = trendColor
                                )
                            }
                        }
                    }

                    if (subtitle != null) {
                        Text(
                            text = subtitle,
                            style = MaterialTheme.typography.labelSmall,
                            color = SecondaryText,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun CampaignHighlightCard(
    title: String,
    campaign: Campaign?,
    isTopPerformer: Boolean,
    modifier: Modifier = Modifier
) {
    val borderColor = if (isTopPerformer) SuccessGreen.copy(alpha = 0.5f) else WarningOrange.copy(alpha = 0.5f)
    val headerBg = if (isTopPerformer) SuccessGreenContainer else WarningOrangeContainer
    val headerIcon = if (isTopPerformer) Icons.Rounded.Star else Icons.Rounded.Warning
    val iconColor = if (isTopPerformer) SuccessGreen else WarningOrange

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = androidx.compose.foundation.BorderStroke(1.dp, borderColor)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(headerBg),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = headerIcon,
                        contentDescription = null,
                        tint = iconColor,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = iconColor
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            if (campaign != null) {
                Text(
                    text = campaign.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "${campaign.type.displayName} • ${campaign.channel}",
                    style = MaterialTheme.typography.bodySmall,
                    color = SecondaryText
                )

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(
                            text = "ROAS",
                            style = MaterialTheme.typography.labelSmall,
                            color = SecondaryText
                        )
                        Text(
                            text = String.format("%.2fx", campaign.roas),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (campaign.roas >= campaign.targetRoas) SuccessGreen else DangerRed
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "Revenue",
                            style = MaterialTheme.typography.labelSmall,
                            color = SecondaryText
                        )
                        Text(
                            text = campaign.revenue.toRupiah(),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Progress towards target ROAS
                val progress = if (campaign.targetRoas > 0) (campaign.roas / campaign.targetRoas).toFloat().coerceIn(0f, 1f) else 0f
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Target ROAS: ${campaign.targetRoas}x",
                            style = MaterialTheme.typography.labelSmall,
                            color = SecondaryText
                        )
                        Text(
                            text = "${(progress * 100).toInt()}%",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = if (progress >= 1f) SuccessGreen else WarningOrange
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    LinearProgressIndicator(
                        progress = { progress },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp)),
                        color = if (progress >= 1f) SuccessGreen else WarningOrange,
                        trackColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                }
            } else {
                Text(
                    text = "No campaign data available",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SecondaryText
                )
            }
        }
    }
}

@Composable
fun TargetVsActualCard(
    modifier: Modifier = Modifier,
    totalSpend: Double = 22600000.0,
    totalBudget: Double = 29000000.0,
    totalRevenue: Double = 120200000.0,
    targetRevenue: Double = 131500000.0
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Target vs Actual Performance",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "Overall marketing campaign budget & revenue execution",
                style = MaterialTheme.typography.bodySmall,
                color = SecondaryText
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Attributed Revenue vs Target
            val revenueProgress = if (targetRevenue > 0) (totalRevenue / targetRevenue).toFloat().coerceIn(0f, 1f) else 0f
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Attributed Revenue",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = "${totalRevenue.toRupiah()} / ${targetRevenue.toRupiah()}",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryPurple
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                LinearProgressIndicator(
                    progress = { revenueProgress },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = PrimaryPurple,
                    trackColor = MaterialTheme.colorScheme.surfaceVariant
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${(revenueProgress * 100).toInt()}% of target revenue achieved",
                    style = MaterialTheme.typography.labelSmall,
                    color = SecondaryText
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Spend vs Budget
            val spendProgress = if (totalBudget > 0) (totalSpend / totalBudget).toFloat().coerceIn(0f, 1f) else 0f
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Budget Consumption",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = "${totalSpend.toRupiah()} / ${totalBudget.toRupiah()}",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.Bold,
                        color = SecondaryPurple
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                LinearProgressIndicator(
                    progress = { spendProgress },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = SecondaryPurple,
                    trackColor = MaterialTheme.colorScheme.surfaceVariant
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${(spendProgress * 100).toInt()}% of allocated budget spent",
                    style = MaterialTheme.typography.labelSmall,
                    color = SecondaryText
                )
            }
        }
    }
}

@Composable
fun ChannelPerformanceTable(
    channels: List<ChannelPerformance>,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Channel Performance Breakdown",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "Attributed ROI and conversion stats across marketing channels",
                        style = MaterialTheme.typography.bodySmall,
                        color = SecondaryText
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Scrollable Table for channel details
            val scrollState = rememberScrollState()

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(scrollState)
            ) {
                // Table Header
                Row(
                    modifier = Modifier
                        .background(
                            MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                            shape = RoundedCornerShape(8.dp)
                        )
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Channel",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = SecondaryText,
                        modifier = Modifier.width(140.dp)
                    )
                    Text(
                        text = "Spend",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = SecondaryText,
                        modifier = Modifier.width(110.dp),
                        textAlign = TextAlign.End
                    )
                    Text(
                        text = "Revenue",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = SecondaryText,
                        modifier = Modifier.width(120.dp),
                        textAlign = TextAlign.End
                    )
                    Text(
                        text = "ROAS",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = SecondaryText,
                        modifier = Modifier.width(80.dp),
                        textAlign = TextAlign.End
                    )
                    Text(
                        text = "Reservations",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = SecondaryText,
                        modifier = Modifier.width(100.dp),
                        textAlign = TextAlign.End
                    )
                    Text(
                        text = "Guests",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = SecondaryText,
                        modifier = Modifier.width(80.dp),
                        textAlign = TextAlign.End
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                if (channels.isEmpty()) {
                    Text(
                        text = "No channel performance data available",
                        style = MaterialTheme.typography.bodyMedium,
                        color = SecondaryText,
                        modifier = Modifier.padding(16.dp)
                    )
                } else {
                    channels.forEachIndexed { index, channel ->
                        Row(
                            modifier = Modifier
                                .padding(horizontal = 12.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = channel.channel,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.width(140.dp)
                            )
                            Text(
                                text = channel.spend.toRupiah(),
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.width(110.dp),
                                textAlign = TextAlign.End
                            )
                            Text(
                                text = channel.revenue.toRupiah(),
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.width(120.dp),
                                textAlign = TextAlign.End
                            )

                            // ROAS tag
                            val isHighRoas = channel.roas >= 4.5
                            val roasBg = if (isHighRoas) SuccessGreenContainer else MaterialTheme.colorScheme.surfaceVariant
                            val roasColor = if (isHighRoas) SuccessGreen else MaterialTheme.colorScheme.onSurface
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = roasBg,
                                modifier = Modifier.width(80.dp)
                            ) {
                                Text(
                                    text = String.format("%.2fx", channel.roas),
                                    style = MaterialTheme.typography.labelMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = roasColor,
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier.padding(vertical = 2.dp)
                                )
                            }

                            Text(
                                text = channel.reservations.toString(),
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.width(100.dp),
                                textAlign = TextAlign.End
                            )
                            Text(
                                text = channel.guests.toString(),
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.width(80.dp),
                                textAlign = TextAlign.End
                            )
                        }

                        if (index < channels.size - 1) {
                            HorizontalDivider(
                                color = BorderColor.copy(alpha = 0.6f),
                                modifier = Modifier.padding(horizontal = 8.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ManagementInsightItemCard(
    insight: ManagementInsight,
    modifier: Modifier = Modifier
) {
    val (bgColor, borderColor, iconColor, icon) = when (insight.type) {
        InsightType.POSITIVE -> Quadruple(SuccessGreenContainer, SuccessGreen, SuccessGreen, Icons.Rounded.CheckCircle)
        InsightType.WARNING -> Quadruple(WarningOrangeContainer, WarningOrange, WarningOrange, Icons.Rounded.Warning)
        InsightType.NEGATIVE -> Quadruple(DangerRedContainer, DangerRed, DangerRed, Icons.Rounded.Info)
        InsightType.RECOMMENDATION -> Quadruple(InfoBlueContainer, InfoBlue, InfoBlue, Icons.Rounded.Lightbulb)
    }

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = bgColor),
        border = androidx.compose.foundation.BorderStroke(1.dp, borderColor.copy(alpha = 0.4f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.Top
        ) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(iconColor.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = insight.type.displayName,
                    tint = iconColor,
                    modifier = Modifier.size(16.dp)
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = insight.type.displayName.uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = iconColor
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = insight.message,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}

private data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)
