export interface CurrentSession {
  context: Context;
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  currently_playing_type: string;
  item: Item;
}
export interface Context {
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}
export interface ExternalUrls {
  spotify: string;
}
export interface Item {
  album: Album;
  artists?: (ArtistsEntity)[] | null;
  available_markets?: (string)[] | null;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}
export interface Album {
  album_type: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images?: (ImagesEntity)[] | null;
  name: string;
  type: string;
  uri: string;
}
export interface ImagesEntity {
  height: number;
  url: string;
  width: number;
}
export interface ArtistsEntity {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}
export interface ExternalIds {
  isrc: string;
}
