package com.indenotto.indenotto;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import android.app.PendingIntent;
import android.content.Intent;

public class InDenOttoWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_layout);

            SharedPreferences prefs = context.getSharedPreferences("HomeWidgetPreferences", Context.MODE_PRIVATE);
            boolean isDriving = prefs.getBoolean("isDriving", false);
            int availableCount = prefs.getInt("availableCount", 0);
            String availableNames = prefs.getString("availableNames", "");

            // Update status
            if (isDriving) {
                views.setTextViewText(R.id.status_text, "In den otto! 🚗");
                views.setTextViewText(R.id.available_text,
                    availableCount > 0
                        ? availableCount + " beschikbaar: " + availableNames
                        : "Niemand beschikbaar"
                );
                views.setInt(R.id.widget_background, "setBackgroundResource", R.drawable.widget_bg_active);
            } else {
                views.setTextViewText(R.id.status_text, "Niet aan het rijden");
                views.setTextViewText(R.id.available_text, "Tik om te starten");
                views.setInt(R.id.widget_background, "setBackgroundResource", R.drawable.widget_bg_inactive);
            }

            // Click to open app
            Intent intent = context.getPackageManager()
                .getLaunchIntentForPackage(context.getPackageName());
            if (intent != null) {
                PendingIntent pendingIntent = PendingIntent.getActivity(
                    context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                views.setOnClickPendingIntent(R.id.widget_background, pendingIntent);
            }

            appWidgetManager.updateAppWidget(widgetId, views);
        }
    }
}
