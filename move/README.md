# The contract
  * game_nfts to handle the game logic and nfts

# Deployment
```
# Create profile
aptos init --profile devnet
# Confirm that code compiles
aptos move compile --named-addresses the_game=devnet
# Deploy
yes | aptos move publish --named-addresses the_game=devnet --profile=devnet
```

# Testing
```
yes | aptos move run --function-id 3a2ad9a4a252b57d304bd6242443603b4dbd54bc40933815571a1e63053214c4::game_manager::init_game --args u64:60 u64:10000000 u64:64 u64:4 --profile devnet

yes | aptos move run --function-id 3a2ad9a4a252b57d304bd6242443603b4dbd54bc40933815571a1e63053214c4::game_manager::join_game --args string:"test1" string:"test" string:"test_uri" --profile devnet

yes | aptos move run --function-id 3a2ad9a4a252b57d304bd6242443603b4dbd54bc40933815571a1e63053214c4::game_manager::close_joining --args --profile devnet

```