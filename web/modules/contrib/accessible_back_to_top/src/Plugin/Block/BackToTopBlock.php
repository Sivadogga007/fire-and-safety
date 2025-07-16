<?php

namespace Drupal\accessible_back_to_top\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Back to top' Block.
 *
 * @Block(
 *   id = "back_to_top_block",
 *   admin_label = @Translation("Back to top block")
 * )
 */
class BackToTopBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build['content'] = [
      '#markup' => '<div aria-hidden="true" role="button" tabindex="0" class="back-to-top"><div class="icon"></div><div class="text">Top</div></div>',
    ];
    $build['#attached']['library'][] = 'accessible_back_to_top/back-to-top';
    return $build;
  }

}
