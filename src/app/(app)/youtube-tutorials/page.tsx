
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube } from "lucide-react";

interface Playlist {
  id: string;
  title: string;
  embedUrl: string;
}

const playlists: Playlist[] = [
  {
    id: "PLKrMFg1EPRmGbc3vn5o8riPrjpsH5rQ4S",
    title: "Class 10th Social Studies (SST)",
    embedUrl: "https://www.youtube.com/embed/videoseries?list=PLKrMFg1EPRmGbc3vn5o8riPrjpsH5rQ4S"
  },
  {
    id: "PLxBrTGIVCrU7bX_Mn6wnpOC2ZpgrN95GN",
    title: "Class 10th Science",
    embedUrl: "https://www.youtube.com/embed/videoseries?list=PLxBrTGIVCrU7bX_Mn6wnpOC2ZpgrN95GN"
  },
];

export default function YouTubeTutorialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Curated YouTube Tutorials</h1>
        <p className="text-muted-foreground">
          Explore handpicked educational playlists directly on EduSpark.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {playlists.map((playlist) => (
            <Card key={playlist.id} className="overflow-hidden">
              <CardHeader>
                  <CardTitle>{playlist.title}</CardTitle>
              </CardHeader>
              <div className="aspect-video">
                  <iframe
                      className="w-full h-full"
                      src={playlist.embedUrl}
                      title={`YouTube video playlist player - ${playlist.title}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                  ></iframe>
              </div>
            </Card>
        ))}
      </div>
    </div>
  );
}
