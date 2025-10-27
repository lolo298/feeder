async function Feed({ params }: PageProps<'/feed/[feedId]'>) {
  const { feedId } = await params;
  return <div>{feedId}</div>;
}

export default Feed;
