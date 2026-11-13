import {NextResponse} from "next/server";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request){
 const p=new URL(request.url).searchParams,track=(p.get("track")||"").trim(),artist=(p.get("artist")||"").trim(),album=(p.get("album")||"").trim(),duration=Number(p.get("duration")||0);
 if(!track)return NextResponse.json({error:"Track title is required."},{status:400});
 if(track.length>180||artist.length>180||album.length>180)return NextResponse.json({error:"Search details are too long."},{status:400});
 const headers={"User-Agent":"WAVELENGTH/1.0 (lyrics lookup)"};
 try{
  const exact=new URL("https://lrclib.net/api/get");exact.searchParams.set("track_name",track);if(artist)exact.searchParams.set("artist_name",artist);if(album)exact.searchParams.set("album_name",album);if(Number.isFinite(duration)&&duration>0)exact.searchParams.set("duration",String(Math.round(duration)));
  let response=await fetch(exact,{headers,cache:"no-store",signal:AbortSignal.timeout(9000)});
  if(response.ok)return NextResponse.json(await response.json(),{headers:{"Cache-Control":"public, s-maxage=3600, stale-while-revalidate=86400"}});
  const search=new URL("https://lrclib.net/api/search");search.searchParams.set("track_name",track);if(artist)search.searchParams.set("artist_name",artist);
  response=await fetch(search,{headers,cache:"no-store",signal:AbortSignal.timeout(9000)});if(!response.ok)throw Error("lyrics service unavailable");
  const results=await response.json(),ranked=(Array.isArray(results)?results:[]).sort((a,b)=>Number(Boolean(b.syncedLyrics))-Number(Boolean(a.syncedLyrics)));
  if(!ranked.length)return NextResponse.json({error:"No matching lyrics were found."},{status:404});
  return NextResponse.json(ranked[0],{headers:{"Cache-Control":"public, s-maxage=3600, stale-while-revalidate=86400"}});
 }catch(error){return NextResponse.json({error:error?.name==="TimeoutError"?"Lyrics lookup timed out.":"Lyrics service is temporarily unavailable."},{status:502})}
}
