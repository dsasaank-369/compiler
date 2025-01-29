public class LongestPalindromicSubstring {

    // Function to find the longest palindromic substring
    public static String longestPalindrome(String s) {
        if (s == null || s.length() < 1) {
            return "";
        }

        int start = 0, end = 0;

        // Loop through each character in the string
        for (int i = 0; i < s.length(); i++) {
            // Expand around center (for both odd and even length palindromes)
            int len1 = expandAroundCenter(s, i, i);      // Odd length palindrome
            int len2 = expandAroundCenter(s, i, i + 1);  // Even length palindrome

            // Get the maximum length palindrome found
            int len = Math.max(len1, len2);

            // If this palindrome is longer than previous ones, update start and end indices
            if (len > end - start) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }

        // Return the longest palindrome substring
        return s.substring(start, end + 1);
    }

    // Helper function to expand around the center and find the length of the palindrome
    private static int expandAroundCenter(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;  // Return the length of the palindrome
    }

    public static void main(String[] args) {
        // Test cases
        Scanne

        System.out.println("Longest Palindrome in \"" + input1 + "\": " + longestPalindrome(input1));
        System.out.println("Longest Palindrome in \"" + input2 + "\": " + longestPalindrome(input2));
        System.out.println("Longest Palindrome in \"" + input3 + "\": " + longestPalindrome(input3));
    }
}
