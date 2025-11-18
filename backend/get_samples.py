import pandas as pd

df = pd.read_csv('data/dataset.csv')
df['hit'] = (df['popularity'] >= df['popularity'].quantile(0.7)).astype(int)

hits = df[df['hit']==1].sample(3, random_state=42)
misses = df[df['hit']==0].sample(3, random_state=42)

print('=== 3 SAMPLE HITS (High Popularity) ===\n')
for i, row in hits.iterrows():
    print(f'\nTrack: {row["track_name"]} by {row["artists"]}')
    print(f'Popularity: {row["popularity"]}')
    print(f'tempo={row["tempo"]:.1f}, energy={row["energy"]:.2f}, danceability={row["danceability"]:.2f}')
    print(f'loudness={row["loudness"]:.1f}, valence={row["valence"]:.2f}, acousticness={row["acousticness"]:.2f}')
    print(f'instrumentalness={row["instrumentalness"]:.3f}, liveness={row["liveness"]:.2f}, speechiness={row["speechiness"]:.2f}')
    print(f'duration_ms={int(row["duration_ms"])}, key={int(row["key"])}, mode={int(row["mode"])}, time_signature={int(row["time_signature"])}')

print('\n\n=== 3 SAMPLE MISSES (Low Popularity) ===\n')
for i, row in misses.iterrows():
    print(f'\nTrack: {row["track_name"]} by {row["artists"]}')
    print(f'Popularity: {row["popularity"]}')
    print(f'tempo={row["tempo"]:.1f}, energy={row["energy"]:.2f}, danceability={row["danceability"]:.2f}')
    print(f'loudness={row["loudness"]:.1f}, valence={row["valence"]:.2f}, acousticness={row["acousticness"]:.2f}')
    print(f'instrumentalness={row["instrumentalness"]:.3f}, liveness={row["liveness"]:.2f}, speechiness={row["speechiness"]:.2f}')
    print(f'duration_ms={int(row["duration_ms"])}, key={int(row["key"])}, mode={int(row["mode"])}, time_signature={int(row["time_signature"])}')
