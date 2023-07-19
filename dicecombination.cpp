#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
int m = 1e9+7;

/*
 1->6 then sum add upto when it is less than n
 after that return
 if we get 4 as
 ll dfs(int n)
{
    if(n==0) return 1;
    if(n<0) return 0;
    ll ans =0;
    for(int i=1;i<=6;i++)
    {
       ans+=dfs(n-i);
    }
    ans %=m;
    return ans;
} 
*/

void solve()
{ 
  int n ; cin>>n; 
  vector<ll>dp(n+1,0);  dp[0]=1;
  for(int i=1;i<=n;i++)
  {
    for(int k=1;k<=6;k++)
    {
        if(i-k>=0)
        {
            dp[i] = (dp[i]%m + dp[i-k]%m +m)%m;;
            dp[i] %= m;
        }
    }
  }
   cout<<dp[n];
}

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL); 
    int t= 1;
    while(t--)
    {
        solve();
    }
    return 0;
}