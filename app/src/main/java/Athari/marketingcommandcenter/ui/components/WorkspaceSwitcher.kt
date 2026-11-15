package Athari.marketingcommandcenter.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.UnfoldMore
import androidx.compose.material.icons.rounded.Storefront
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import Athari.marketingcommandcenter.data.model.Workspace
import Athari.marketingcommandcenter.ui.theme.BorderColor
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryText

@Composable
fun WorkspaceSwitcher(
    currentWorkspace: Workspace,
    onWorkspaceSelected: (Workspace) -> Unit,
    modifier: Modifier = Modifier,
    isCondensed: Boolean = false
) {
    var expanded by remember { mutableStateOf(false) }

    val availableWorkspaces = remember {
        listOf(
            Workspace(
                id = "REST-001",
                name = "Gourmet Bistro Cafe & Resto",
                location = "Jakarta, Indonesia",
                type = "Casual Dining & Resto"
            ),
            Workspace(
                id = "REST-002",
                name = "Urban Eats Downtown",
                location = "Bandung, Indonesia",
                type = "Fast Casual & Bistro"
            ),
            Workspace(
                id = "REST-003",
                name = "Sunset Lounge Bali",
                location = "Bali, Indonesia",
                type = "Beach Club & Bar"
            )
        )
    }

    Box(modifier = modifier) {
        if (isCondensed) {
            // Rail condensed icon view
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(PrimaryPurple)
                    .clickable { expanded = true },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Rounded.Storefront,
                    contentDescription = "Switch Workspace",
                    tint = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(24.dp)
                )
            }
        } else {
            // Full expanded width view
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
                    .clickable { expanded = true },
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(PrimaryPurple),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = currentWorkspace.name.take(1).uppercase(),
                            color = MaterialTheme.colorScheme.onPrimary,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column(
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(
                            text = currentWorkspace.name,
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Text(
                            text = "${currentWorkspace.type} • ${currentWorkspace.location.split(",").firstOrNull() ?: ""}",
                            style = MaterialTheme.typography.labelSmall,
                            color = SecondaryText,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }

                    Icon(
                        imageVector = Icons.Rounded.UnfoldMore,
                        contentDescription = "Switch Workspace",
                        tint = SecondaryText,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier
                .background(MaterialTheme.colorScheme.surface)
                .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
        ) {
            Text(
                text = "WORKSPACES",
                style = MaterialTheme.typography.labelSmall,
                color = SecondaryText,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            availableWorkspaces.forEach { ws ->
                val isSelected = ws.id == currentWorkspace.id
                DropdownMenuItem(
                    text = {
                        Column {
                            Text(
                                text = ws.name,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) PrimaryPurple else MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "${ws.type} • ${ws.location}",
                                style = MaterialTheme.typography.labelSmall,
                                color = SecondaryText
                            )
                        }
                    },
                    leadingIcon = {
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(if (isSelected) PrimaryPurple else MaterialTheme.colorScheme.surfaceVariant),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = ws.name.take(1).uppercase(),
                                color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    },
                    trailingIcon = {
                        if (isSelected) {
                            Icon(
                                imageVector = Icons.Rounded.Check,
                                contentDescription = "Selected",
                                tint = PrimaryPurple,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    },
                    onClick = {
                        onWorkspaceSelected(ws)
                        expanded = false
                    }
                )
            }
        }
    }
}
