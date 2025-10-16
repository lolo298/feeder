async function Feed({ params }: { params: Promise<{ feedId: string }> }) {
  const { feedId } = await params;
  return <div>{feedId}</div>;
}

export default Feed;
