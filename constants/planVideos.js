// planVideos.js
function getVidalyticsEmbed(divId, embedId) {
  return `<div id="${divId}" style="width: 100%; position:relative; padding-top: 56.25%;"></div>
  <script type="text/javascript">
  (function (v, i, d, a, l, y, t, c, s) {
      y='_'+d.toLowerCase();c=d+'L';if(!v[d]){v[d]={};}if(!v[c]){v[c]={};}if(!v[y]){v[y]={};}var vl='Loader',vli=v[y][vl],vsl=v[c][vl + 'Script'],vlf=v[c][vl + 'Loaded'],ve='Embed';
      if (!vsl){vsl=function(u,cb){
          if(t){cb();return;}s=i.createElement("script");s.type="text/javascript";s.async=1;s.src=u;
          if(s.readyState){s.onreadystatechange=function(){if(s.readyState==="loaded"||s.readyState=="complete"){s.onreadystatechange=null;vlf=1;cb();}};}else{s.onload=function(){vlf=1;cb();};}
          i.getElementsByTagName("head")[0].appendChild(s);
      };}
      vsl(l+'loader.min.js',function(){if(!vli){var vlc=v[c][vl];vli=new vlc();}vli.loadScript(l+'player.min.js',function(){var vec=v[d][ve];t=new vec();t.run(a);});});
  })(window, document, 'Vidalytics', '${divId}', 'https://fast.vidalytics.com/embeds/ZIosmfug/${embedId}/');
  </script>`;
}

function getPlanVideoScript(plan, shouldShowIndianContent, isRestOfTheWorld) {
  const videoIds = {
    pro: {
      row: {
        divId: "vidalytics_embed_iZT9ZIUw_EvlcRb6",
        embedId: "iZT9ZIUw_EvlcRb6",
      },
      india: {
        divId: "vidalytics_embed_qspUqz8f6z8IBFgh",
        embedId: "qspUqz8f6z8IBFgh",
      },
      default: {
        divId: "vidalytics_embed_sJnsHGgHolef8Tbt",
        embedId: "sJnsHGgHolef8Tbt",
      },
    },
    super: {
      row: {
        divId: "vidalytics_embed_YvkYAYMzuR73HBt0",
        embedId: "YvkYAYMzuR73HBt0",
      },
      india: {
        divId: "vidalytics_embed_lwqBklT_xlzuNk4N",
        embedId: "lwqBklT_xlzuNk4N",
      },
      default: {
        divId: "vidalytics_embed_XWbAqpidVxrm451J",
        embedId: "XWbAqpidVxrm451J",
      },
    },
    lifetime: {
      row: {
        divId: "vidalytics_embed_YvkYAYMzuR73HBt0",
        embedId: "YvkYAYMzuR73HBt0",
      },
      india: {
        divId: "vidalytics_embed_lwqBklT_xlzuNk4N",
        embedId: "lwqBklT_xlzuNk4N",
      },
      default: {
        divId: "vidalytics_embed_XWbAqpidVxrm451J",
        embedId: "XWbAqpidVxrm451J",
      },
    },
  };

  const ids = videoIds[plan];
  if (!ids) {
    console.error(`No video IDs found for plan: ${plan}`);
    return "";
  }

  if (shouldShowIndianContent) {
    return getVidalyticsEmbed(ids.india.divId, ids.india.embedId);
  } else if (isRestOfTheWorld) {
    return getVidalyticsEmbed(ids.row.divId, ids.row.embedId);
  } else {
    return getVidalyticsEmbed(ids.default.divId, ids.default.embedId);
  }
}

function getPlanThumbnail(plan, shouldShowIndianContent, isRestOfTheWorld) {
  const thumbnails = {
    pro: {
      row: "https://cdn.memorae.ai/Pro-row.gif",
      india: "https://cdn.memorae.ai/pro-india.gif",
      default: "https://cdn.memorae.ai/proSpanish.gif",
    },
    super: {
      row: "https://cdn.memorae.ai/Supernova-row.gif",
      india: "https://cdn.memorae.ai/supernova-india.gif",
      default: "https://cdn.memorae.ai/superNovaSpanish.gif",
    },
    lifetime: {
      row: "https://cdn.memorae.ai/Supernova-row.gif",
      india: "https://cdn.memorae.ai/supernova-india.gif",
      default: "https://cdn.memorae.ai/superNovaSpanish.gif",
    },
  };

  const planThumbs = thumbnails[plan];
  if (!planThumbs) {
    console.error(`No thumbnails found for plan: ${plan}`);
    return "";
  }

  if (shouldShowIndianContent) {
    return planThumbs.india;
  } else if (isRestOfTheWorld) {
    return planThumbs.row;
  } else {
    return planThumbs.default;
  }
}

export const planVideos = (shouldShowIndianContent, isRestOfTheWorld) => {
  const plans = ["pro", "super", "lifetime"];
  const result = {};
  plans.forEach((plan) => {
    result[plan] = {
      videoScript: getPlanVideoScript(
        plan,
        shouldShowIndianContent,
        isRestOfTheWorld
      ),
      thumbnail: getPlanThumbnail(
        plan,
        shouldShowIndianContent,
        isRestOfTheWorld
      ),
    };
  });
  return result;
};

export default planVideos;
