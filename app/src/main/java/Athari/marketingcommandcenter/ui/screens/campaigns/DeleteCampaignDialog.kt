package Athari.marketingcommandcenter.ui.screens.campaigns

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.DeleteForever
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.ui.theme.DangerRed

@Composable
fun DeleteCampaignDialog(
    campaign: Campaign,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        icon = {
            Icon(
                imageVector = Icons.Rounded.DeleteForever,
                contentDescription = "Delete",
                tint = DangerRed
            )
        },
        title = {
            Text(
                text = "Delete campaign '${campaign.name}'?",
                style = MaterialTheme.typography.titleMedium
            )
        },
        text = {
            Text(
                text = "Are you sure you want to delete campaign '${campaign.name}' (${campaign.code})? This action cannot be undone.",
                style = MaterialTheme.typography.bodyMedium
            )
        },
        confirmButton = {
            TextButton(
                onClick = onConfirm,
                colors = ButtonDefaults.textButtonColors(contentColor = DangerRed)
            ) {
                Text("Delete")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
