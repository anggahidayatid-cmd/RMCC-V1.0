package Athari.marketingcommandcenter.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val LightColorScheme = lightColorScheme(
    primary = PrimaryPurple,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFECEEFE),
    onPrimaryContainer = Color(0xFF232870),
    secondary = SecondaryPurple,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFF0EBFC),
    onSecondaryContainer = Color(0xFF33206B),
    tertiary = AccentBlue,
    onTertiary = Color.White,
    tertiaryContainer = Color(0xFFEBF0FE),
    onTertiaryContainer = Color(0xFF1E2D6A),
    background = AppBackground,
    onBackground = DarkText,
    surface = CardBackground,
    onSurface = DarkText,
    surfaceVariant = Color(0xFFF0F2F8),
    onSurfaceVariant = SecondaryText,
    outline = BorderColor,
    outlineVariant = BorderColor,
    error = DangerRed,
    onError = Color.White,
    errorContainer = DangerRedContainer,
    onErrorContainer = DangerRed
)

private val DarkColorScheme = darkColorScheme(
    primary = SecondaryPurple,
    onPrimary = DarkBackground,
    primaryContainer = PrimaryPurple,
    onPrimaryContainer = Color.White,
    secondary = AccentBlue,
    onSecondary = DarkBackground,
    background = DarkBackground,
    onBackground = DarkTextLight,
    surface = DarkCardBackground,
    onSurface = DarkTextLight,
    surfaceVariant = Color(0xFF282B3E),
    onSurfaceVariant = DarkSecondaryText,
    outline = DarkBorderColor,
    outlineVariant = DarkBorderColor,
    error = Color(0xFFFFB4AB),
    onError = Color(0xFF690005)
)

@Composable
fun MarketingCommandCenterTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false, // Set to false by default to ensure design system brand colors are strictly preserved unless requested
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        shapes = AppShapes,
        content = content
    )
}
