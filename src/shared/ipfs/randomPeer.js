const mapPeers = {
  1: 'https://peer1.ipfsprivi.com:5001',
  2: 'https://peer2.ipfsprivi.com:5001',
  3: 'https://peer3.ipfsprivi.com:5001',
  4: 'https://peer4.ipfsprivi.com:5001',
  5: 'https://peer5.ipfsprivi.com:5001',
  6: 'https://peer6.ipfsprivi.com:5001'
}

export const randomPeer = () => {
  const random = randomNumber(6);
  console.log(random);
  return({
    number: random,
    url: mapPeers[random]
  })
}

// random number form 1 to max
const randomNumber = (max) => {
  return(Math.floor(Math.random() * max) + 1);
}
