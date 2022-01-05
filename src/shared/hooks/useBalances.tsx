import { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { RootState } from "store/reducers/Reducer";

// total balance in usd
export const useBalances = () => {
  const { convertTokenToUSD } = useTokenConversion();
  const userBalances = useTypedSelector((state: RootState) => state.userBalances) as any;
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    let total = 0;
    let obj: any;
    for (obj of Object.values(userBalances)) {
      total += convertTokenToUSD(obj.Token, obj.Balance);
    }
    setTotalBalance(total);
  }, [userBalances]);

  return { totalBalance };
};
