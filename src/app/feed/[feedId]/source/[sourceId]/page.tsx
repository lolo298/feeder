async function Source({ params }: { params: Promise<{ feedId: string; sourceId: string }> }) {
  const { feedId, sourceId } = await params;
  return (
    <div>
      {feedId} - {sourceId}
    </div>
  );
}

export default Source;
