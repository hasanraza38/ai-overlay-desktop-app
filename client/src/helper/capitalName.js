  export function capitalizeName(name) {
    if (!name) return "";
    return name
      .split(/[\s._]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }