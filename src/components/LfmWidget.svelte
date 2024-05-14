<script lang="ts">
    import { onMount } from "svelte";

    interface TrackSkeletonUnparsed {
        image: {size: "large", "#text": string}[],
        name: string,
        artist: {"#text": string},
        album: {"#text": string},
        url: string
    }

    type TrackSkeleton = Record<keyof TrackSkeletonUnparsed, string>

    let track: TrackSkeleton | undefined = undefined;
    let altTxt;
    // lazy
    $: altTxt = track?.image ? `album art for ${track.album} by ${track.artist}` : "missing album art"
    
    async function fetchLatest() {
        let res = await fetch('https://lastfm-api.dev.madhouselabs.net/getRecentTracks?username=micro_bmp');
        let { recenttracks: { track: [unparsedTrack] } }: { recenttracks: {track: [TrackSkeletonUnparsed]} } = await res.json()

        track = {
            image: unparsedTrack.image.find(e => e.size === "large")["#text"],
            name: unparsedTrack.name,
            artist: unparsedTrack.artist["#text"],
            album: unparsedTrack.album["#text"],
            url: unparsedTrack.url
        }
    }

    onMount(fetchLatest)
</script>

<style>
    /*lastfm shit*/
    .lastfm {display:flex;align-items:normal;justify-content:center;margin-bottom:32px;}
    .box {display: flex;max-width: 420px;padding-top: 16px;border-left: 4px solid var(--header);background: var(--darkCol);}
    .art{flex: 0 0 auto;margin-right: 12px;height:auto;width:100px;}
    .info{flex: 1 1 auto;display: flex;flex-direction: column;justify-content: center;}
    .track, .artist, .album{margin: 0;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;word-wrap:anywhere;}
    .info p{font-size:12px;}
    .info h2{font-size:20px;} 
    h2::before { all: unset }
    .artist,.album{color:var(--pre);}
    .link{width:100px;height:100px;margin-right:12px;}
    .ellipse{-webkit-line-clamp:2;white-space:break-spaces;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;}
</style>

<div class="lastfm">
    <div class="box">
        <a href={track?.url} target="_blank" class="link">
            <img src={track?.image || "/GJfn6VyacAAyE1M.png"} class="art" alt={altTxt} title={altTxt}/>
        </a>
        <div class="info">
            <h2 class="track ub wht ellipse">{track?.name || "..."}</h2>
            <p class="artist ub ellipse">by {track?.artist || "..."}</p>
            {#if track && "album" in track}
                <p class="album ub ellipse">on {track.album}</p>
            {/if}
        </div>
    </div>
</div>