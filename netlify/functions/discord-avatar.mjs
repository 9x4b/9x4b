
export default async function handler() {
  const userId = "1235531970839187547";
  const token = Netlify.env.get("DISCORD_BOT_TOKEN");

  if (!token) {
    return Response.json(
      { error: "Discord token is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/users/${userId}`,
      {
        headers: {
          Authorization: `Bot ${token}`
        }
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Discord could not return the user" },
        { status: 502 }
      );
    }

    const user = await response.json();

    let url;

    if (user.avatar) {
      const format = user.avatar.startsWith("a_")
        ? "gif"
        : "png";

      url =
        `https://cdn.discordapp.com/avatars/` +
        `${user.id}/${user.avatar}.${format}?size=256`;
    } else {
      url =
        `https://cdn.discordapp.com/embed/avatars/` +
        `${Number(BigInt(user.id) >> 22n) % 6}.png`;
    }

    return Response.json(
      { url },
      {
        headers: {
          "Cache-Control": "public, max-age=60"
        }
      }
    );
  } catch {
    return Response.json(
      { error: "Unable to fetch Discord avatar" },
      { status: 500 }
    );
  }
}
