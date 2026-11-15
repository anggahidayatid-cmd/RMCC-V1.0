package Athari.marketingcommandcenter.ui.screens.campaigns

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import Athari.marketingcommandcenter.data.model.CampaignStatus
import Athari.marketingcommandcenter.ui.theme.InfoBlue
import Athari.marketingcommandcenter.ui.theme.InfoBlueContainer
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.theme.SuccessGreen
import Athari.marketingcommandcenter.ui.theme.SuccessGreenContainer
import Athari.marketingcommandcenter.ui.theme.WarningOrange
import Athari.marketingcommandcenter.ui.theme.WarningOrangeContainer

@Composable
fun CampaignStatusPill(
    status: CampaignStatus,
    modifier: Modifier = Modifier
) {
    val (backgroundColor, textColor) = when (status) {
        CampaignStatus.ACTIVE -> Pair(SuccessGreenContainer, SuccessGreen)
        CampaignStatus.SCHEDULED -> Pair(InfoBlueContainer, InfoBlue)
        CampaignStatus.PAUSED -> Pair(WarningOrangeContainer, WarningOrange)
        CampaignStatus.COMPLETED -> Pair(PrimaryPurple.copy(alpha = 0.15f), PrimaryPurple)
        CampaignStatus.DRAFT -> Pair(Color.LightGray.copy(alpha = 0.3f), Color.DarkGray)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(50))
            .background(backgroundColor)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(
            text = status.displayName,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = textColor
        )
    }
}
