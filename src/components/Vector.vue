<template>
  <div id="vector">
      <svg width="75" height="83" viewBox="0 0 75 83" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M70.0734 35.0347L62.1028 10.4113C61.8162 9.53084 61.2445 8.76841 60.4763 8.24197C59.708 7.71553 58.786 7.45443 57.8528 7.49904L52.4999 7.71746C51.3876 7.74546 50.3311 8.20576 49.5587 8.99886L9.47048 49.9892C8.75055 50.728 8.32709 51.7012 8.2793 52.7268L7.85283 61.2743C7.81202 62.1102 8.02208 62.9393 8.45652 63.6571C8.89096 64.3749 9.53033 64.9493 10.294 65.3078L28.2499 73.7534C29.1708 74.1727 30.2094 74.2653 31.1911 74.0155L34.2646 73.1564C34.9776 72.9614 35.6266 72.5849 36.1469 72.0643L69.0293 39.3157C69.5801 38.7636 69.9684 38.0732 70.1523 37.3189C70.3363 36.5645 70.309 35.7748 70.0734 35.0347Z" fill="#FCE8C0"/>
        <path d="M72.5883 33.9718L63.7648 6.59638C63.39 5.46786 62.6556 4.49018 61.6718 3.81015C60.688 3.13011 59.508 2.78442 58.3089 2.82498L52.3531 3.07252C50.9499 3.12833 49.6226 3.71769 48.6472 4.71796L18.2354 35.7629L16.9707 37.0588L4.01482 50.3097C3.1128 51.2653 2.59045 52.5118 2.54423 53.819L2.07364 63.3131C2.01904 64.3686 2.27834 65.4168 2.81943 66.3279C3.36051 67.239 4.15961 67.9728 5.11776 68.4387L25.0736 77.8453C25.8085 78.1922 26.6125 78.3713 27.4266 78.3695C27.9238 78.3672 28.4184 78.2986 28.8972 78.1657L32.3531 77.2629C32.8404 77.1306 33.3059 76.9295 33.7354 76.6659H33.8678C33.989 76.6648 34.1082 76.6351 34.2156 76.5794C34.323 76.5238 34.4155 76.4436 34.4854 76.3455L34.9266 75.6757L71.2501 39.4615C71.9573 38.7541 72.4557 37.8688 72.6916 36.9012C72.9275 35.9337 72.8918 34.9207 72.5883 33.9718ZM21.4413 53.6443L18.5001 37.5394L18.9707 37.0588L64.5589 25.1185L21.4413 53.6443ZM49.6619 5.7227C50.3781 4.99052 51.3536 4.5624 52.3825 4.52866L58.3531 4.28112H58.5148C59.3642 4.28037 60.192 4.54638 60.879 5.04091C61.5661 5.53543 62.077 6.23298 62.3383 7.03323L67.456 22.8615L21.0001 35.0348L49.6619 5.7227ZM3.94129 53.8773C3.98652 52.9125 4.38363 51.9968 5.05894 51.2999L17.2942 38.8062L20.0001 53.9501L19.7354 54.7801L3.85305 65.2788C3.56382 64.6907 3.43215 64.0389 3.4707 63.3859L3.94129 53.8773ZM4.706 66.4438L19.0001 57.008L14.3236 71.2053L5.75011 67.1718C5.36505 66.9921 5.01234 66.751 4.706 66.4583V66.4438ZM31.9119 75.865L28.5001 76.8115C27.5699 77.0739 26.5744 76.9857 25.706 76.5639L15.6619 71.846L20.9707 55.712L65.8383 26.0504L33.7207 74.802C33.2226 75.3076 32.5987 75.6742 31.9119 75.865ZM38.8383 69.691L68.2501 25.1476L71.1913 34.4232C71.4175 35.1145 71.4466 35.8542 71.2754 36.5607C71.1041 37.2673 70.7391 37.9133 70.2207 38.4276L38.8383 69.691Z" fill="#F7DEB0"/>
      </svg>
      <svg width="200" height="200">
        <polygon :points="points"></polygon>
        <circle cx="100" cy="100" r="90"></circle>
      </svg>
      <label>Sides: {{ sides }}</label>
      <input type="range" min="3" max="500" v-model.number="sides" />
      <label>Minimum Radius: {{ minRadius }}%</label>
      <input type="range" min="0" max="90" v-model.number="minRadius" />
      <label>Update Interval: {{ updateInterval }} milliseconds</label>
      <input type="range" min="10" max="2000" v-model.number="updateInterval" />
    </div>
</template>

<script>
export default {
  data () {
    var defaultSides = 10
    var stats = Array.apply(null, { length: defaultSides }).map(
      function () {
        return 100
      }
    )
    return {
      stats: stats,
      points: generatePoints(stats),
      sides: defaultSides,
      minRadius: 50,
      interval: null,
      updateInterval: 500
    }
  },
  watch: {
    sides (newSides, oldSides) {
      const sidesDifference = newSides - oldSides
      if (sidesDifference > 0) {
        for (let i = 1; i <= sidesDifference; i++) {
          this.stats.push(this.newRandomValue())
        }
      } else {
        const absoluteSidesDifference = Math.abs(sidesDifference)
        for (let i = 1; i <= absoluteSidesDifference; i++) {
          this.stats.shift()
        }
      }
    },
    stats (newStats) {
      window.TweenLite.to(this.$data, this.updateInterval / 1000, {
        points: generatePoints(newStats)
      })
    },
    updateInterval () {
      this.resetInterval()
    }
  },
  mounted () {
    this.resetInterval()
  },
  methods: {
    randomizeStats () {
      var vm = this
      this.stats = this.stats.map(function () {
        return vm.newRandomValue()
      })
    },
    newRandomValue () {
      return Math.ceil(
        this.minRadius + Math.random() * (100 - this.minRadius)
      )
    },
    resetInterval () {
      var vm = this
      clearInterval(this.interval)
      this.randomizeStats()
      this.interval = setInterval(function () {
        vm.randomizeStats()
      }, this.updateInterval)
    }
  }
}

function valueToPoint (value, index, total) {
  var x = 0
  var y = -value * 0.9
  var angle = ((Math.PI * 2) / total) * index
  var cos = Math.cos(angle)
  var sin = Math.sin(angle)
  var tx = x * cos - y * sin + 100
  var ty = x * sin + y * cos + 100
  return { x: tx, y: ty }
}

function generatePoints (stats) {
  var total = stats.length
  return stats
    .map(function (stat, index) {
      var point = valueToPoint(stat, index, total)
      return point.x + ',' + point.y
    })
    .join(' ')
}
</script>

<style scoped>
  svg {
    display: block;
  }
  polygon {
    fill: #41b883;
  }
  circle {
    fill: transparent;
    stroke: #35495e;
  }
  input[type="range"] {
    display: block;
    width: 100%;
    margin-bottom: 15px;
  }
</style>
