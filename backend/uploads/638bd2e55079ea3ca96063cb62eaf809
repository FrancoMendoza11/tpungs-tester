// D.java
import java.util.Scanner;

public class D {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        int K = sc.nextInt();
        int[] arr = new int[N];
        for (int i = 0; i < N; i++) arr[i] = sc.nextInt();
        int sum = 0;
        for (int i = 0; i < K; i++) sum += arr[i];
        int maxSum = sum;
        for (int i = K; i < N; i++) {
            sum = sum - arr[i - K] + arr[i];
            if (sum > maxSum) maxSum = sum;
        }
        System.out.println(maxSum);
    }
}
