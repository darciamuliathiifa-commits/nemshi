"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

const places = [
  {
    id: "darrasah",
    name: "Darrasah",
    area: "Dekat Masjid Al-Azhar",
    description: "Kawasan kampus dan aktivitas harian mahasiswa Al-Azhar.",
    coordinates: [30.043385, 31.261838] as [number, number],
  },
  {
    id: "hay-sabi",
    name: "Hay Sabi",
    area: "Nasr City - Distrik 7",
    description: "Hunian mahasiswa dengan akses kebutuhan harian yang ramai.",
    coordinates: [30.043794, 31.330909] as [number, number],
  },
  {
    id: "hay-asyir",
    name: "Hay Asyir",
    area: "Nasr City - Distrik 10",
    description: "Pilihan tempat tinggal di sisi timur kawasan Nasr City.",
    coordinates: [30.048186, 31.365013] as [number, number],
  },
  {
    id: "zahraa",
    name: "Zahraa",
    area: "Zahraa Nasr City",
    description: "Area hunian Masisir yang berkembang di timur Nasr City.",
    coordinates: [30.047669, 31.389963] as [number, number],
  },
];

export function CairoCommunityMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<string, LeafletMarker>());
  const [activeId, setActiveId] = useState(places[0].id);

  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;

    async function initializeMap() {
      if (!containerRef.current || mapRef.current) return;

      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [30.046, 31.33],
        zoom: 12,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const bounds = L.latLngBounds([]);

      places.forEach((place, index) => {
        const icon = L.divIcon({
          className: "",
          html: `<span class="nemsy-map-marker"><b>${index + 1}</b></span>`,
          iconSize: [42, 50],
          iconAnchor: [21, 48],
          popupAnchor: [0, -42],
        });

        const marker = L.marker(place.coordinates, { icon })
          .addTo(map)
          .bindPopup(
            `<strong>${place.name}</strong><br><span>${place.area}</span>`,
          );

        marker.on("click", () => setActiveId(place.id));
        markers.set(place.id, marker);
        bounds.extend(place.coordinates);
      });

      map.fitBounds(bounds, { padding: [34, 34] });
      mapRef.current = map;
    }

    void initializeMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
    };
  }, []);

  function focusPlace(id: string) {
    const place = places.find((item) => item.id === id);
    if (!place || !mapRef.current) return;

    setActiveId(id);
    mapRef.current.flyTo(place.coordinates, 14, { duration: 0.9 });
    markersRef.current.get(id)?.openPopup();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.45fr_0.55fr] lg:gap-5">
      <div className="overflow-hidden rounded-[8px] border-[3px] border-[#005b4f] bg-[#dff8e8] p-2 shadow-[7px_7px_0_0_#006451] sm:p-3">
        <div
          ref={containerRef}
          role="region"
          aria-label="Peta kawasan tempat tinggal mahasiswa Indonesia di Kairo"
          className="cairo-community-map h-[350px] w-full overflow-hidden rounded-[5px] sm:h-[460px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        {places.map((place, index) => {
          const active = activeId === place.id;

          return (
            <button
              key={place.id}
              type="button"
              onClick={() => focusPlace(place.id)}
              aria-pressed={active}
              className={`landing-card-lift flex min-h-36 flex-col rounded-[8px] border-[2.5px] border-[#005b4f] p-3 text-left shadow-[4px_4px_0_0_#006451] transition-colors sm:p-4 lg:min-h-0 ${
                active ? "bg-[#80e6ad]" : "bg-[#fffefa] hover:bg-[#dff8e8]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005b4f] text-[11px] font-extrabold text-[#fff47d]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-right text-[10px] font-bold leading-4 text-[#005b4f]/55">
                  {place.area}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold leading-none sm:text-2xl">
                {place.name}
              </h3>
              <p className="mt-2 text-[11px] font-semibold leading-4 text-[#005b4f]/70 sm:text-xs sm:leading-5">
                {place.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
