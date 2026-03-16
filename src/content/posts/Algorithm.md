---
title: 算法题
published: 2026-03-16
description: '一些理解与我的题解'
image: '/images/sagiri/4.png'
tags: [算法]
category: 'Algorithm'
draft: false 
lang: ''
---
### 二分算法
**第一题**
**[34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/ )**

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int left = -1;
        int right = -1;
        int start = 0;
        int end = nums.length - 1;
        //寻找第一个出现
        while(start <= end){//因为闭区间 等于时也符合
            int mid = (start + end)/2;
            if(nums[mid] == target){
                left = mid;
                end = mid - 1;//继续向左寻找
            }
            else if(nums[mid] > target){
                end = mid - 1;
            }
            else start = mid + 1;
        }
        start = 0;
        end = nums.length - 1;
        //寻找最后一个
        while(start <= end){//因为闭区间 等于时也符合
            int mid = (start + end)/2;
            if(nums[mid] == target){
                right = mid;
                start = mid + 1;//继续向右寻找
            }
            else if(nums[mid] > target){
                end = mid - 1;
            }
            else start = mid + 1;
        }
        if(left == -1 || right == -1){
            int[] res={-1,-1};
            return res;
        }
        int[] res={left,right};
        return res;     
    }
}//感谢大佬题解 时间复杂度O(log n)
```
